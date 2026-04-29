from fastapi import APIRouter, HTTPException, Query, Response, status

from app import crud
from app.dependencies import DbSession
from app.schemas import NoteCreate, NotePatch, NoteRead, NoteUpdate


router = APIRouter(prefix="/notes", tags=["notes"])


@router.get("", response_model=list[NoteRead])
def list_notes(
    db: DbSession,
    search: str | None = Query(default=None, max_length=200),
    tag: str | None = Query(default=None, max_length=100),
    include_archived: bool = False,
):
    return crud.get_notes(
        db,
        search=search,
        tag=tag,
        include_archived=include_archived,
    )


@router.get("/{note_id}", response_model=NoteRead)
def read_note(note_id: int, db: DbSession):
    note = crud.get_note(db, note_id)
    if note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )
    return note


@router.post("", response_model=NoteRead, status_code=status.HTTP_201_CREATED)
def create_note(note_in: NoteCreate, db: DbSession):
    return crud.create_note(db, note_in)


@router.put("/{note_id}", response_model=NoteRead)
def update_note(note_id: int, note_in: NoteUpdate, db: DbSession):
    note = crud.get_note(db, note_id)
    if note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )
    return crud.update_note(db, note, note_in)


@router.patch("/{note_id}", response_model=NoteRead)
def patch_note(note_id: int, note_in: NotePatch, db: DbSession):
    note = crud.get_note(db, note_id)
    if note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )
    return crud.patch_note(db, note, note_in)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int, db: DbSession):
    note = crud.get_note(db, note_id)
    if note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found",
        )
    crud.delete_note(db, note)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
