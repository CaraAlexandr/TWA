from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app import crud
from app.database import get_db
from app.models import User
from app.security import decode_access_token


DbSession = Annotated[Session, Depends(get_db)]

bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    db: DbSession,
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> User:
    auth_error = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or missing authentication token",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credentials is None:
        raise auth_error

    try:
        payload = decode_access_token(credentials.credentials)
        email = payload.get("sub")
    except jwt.PyJWTError as exc:
        raise auth_error from exc

    if not email:
        raise auth_error

    user = crud.get_user_by_email(db, email)
    if user is None or not user.is_active:
        raise auth_error
    return user


CurrentUser = Annotated[User, Depends(get_current_user)]
