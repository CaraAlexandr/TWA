from fastapi import APIRouter, HTTPException, status

from app import crud
from app.dependencies import CurrentUser, DbSession
from app.schemas import Token, UserCreate, UserLogin, UserRead
from app.security import create_access_token


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: DbSession):
    existing_user = crud.get_user_by_email(db, user_in.email)
    if existing_user is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists",
        )
    return crud.create_user(db, user_in)


@router.post("/login", response_model=Token)
def login_user(credentials: UserLogin, db: DbSession):
    user = crud.authenticate_user(db, credentials.email, credentials.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return Token(access_token=create_access_token(user.email))


@router.get("/me", response_model=UserRead)
def read_current_user(current_user: CurrentUser):
    return current_user
