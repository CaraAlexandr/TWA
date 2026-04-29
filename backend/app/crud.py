from sqlalchemy import Select, select
from sqlalchemy.orm import Session

from app.models import Note, User
from app.schemas import NoteCreate, NotePatch, NoteUpdate, UserCreate
from app.security import hash_password, verify_password


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.scalar(select(User).where(User.email == email.lower()))


def create_user(db: Session, user_in: UserCreate) -> User:
    user = User(
        email=user_in.email.lower(),
        full_name=user_in.full_name,
        hashed_password=hash_password(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, email: str, password: str) -> User | None:
    user = get_user_by_email(db, email)
    if user is None or not verify_password(password, user.hashed_password):
        return None
    return user


def get_notes(
    db: Session,
    *,
    owner_id: int,
    search: str | None = None,
    tag: str | None = None,
    include_archived: bool = False,
) -> list[Note]:
    stmt: Select[tuple[Note]] = select(Note).where(Note.owner_id == owner_id)

    if search:
        stmt = stmt.where(Note.title.ilike(f"%{search}%"))
    if tag:
        stmt = stmt.where(Note.tag == tag)
    if not include_archived:
        stmt = stmt.where(Note.is_archived.is_(False))

    stmt = stmt.order_by(Note.is_pinned.desc(), Note.updated_at.desc())
    return list(db.scalars(stmt).all())


def get_note(db: Session, note_id: int, *, owner_id: int) -> Note | None:
    return db.scalar(select(Note).where(Note.id == note_id, Note.owner_id == owner_id))


def create_note(db: Session, note_in: NoteCreate, *, owner_id: int) -> Note:
    note = Note(**note_in.model_dump(), owner_id=owner_id)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def update_note(db: Session, note: Note, note_in: NoteUpdate) -> Note:
    for field, value in note_in.model_dump().items():
        setattr(note, field, value)

    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def patch_note(db: Session, note: Note, note_in: NotePatch) -> Note:
    for field, value in note_in.model_dump(exclude_unset=True).items():
        setattr(note, field, value)

    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def delete_note(db: Session, note: Note) -> None:
    db.delete(note)
    db.commit()
