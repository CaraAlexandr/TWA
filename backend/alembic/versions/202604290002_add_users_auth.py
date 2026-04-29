"""add users and note ownership

Revision ID: 202604290002
Revises: 202604290001
Create Date: 2026-04-29 21:29:00.000000
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "202604290002"
down_revision: str | None = "202604290001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("full_name", sa.String(length=160), nullable=False),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.true()),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
    )
    op.create_index(op.f("ix_users_email"), "users", ["email"], unique=True)
    op.create_index(op.f("ix_users_id"), "users", ["id"], unique=False)

    op.add_column("notes", sa.Column("owner_id", sa.Integer(), nullable=True))
    op.create_index(op.f("ix_notes_owner_id"), "notes", ["owner_id"], unique=False)
    op.create_foreign_key(
        "fk_notes_owner_id_users",
        "notes",
        "users",
        ["owner_id"],
        ["id"],
        ondelete="CASCADE",
    )


def downgrade() -> None:
    op.drop_constraint("fk_notes_owner_id_users", "notes", type_="foreignkey")
    op.drop_index(op.f("ix_notes_owner_id"), table_name="notes")
    op.drop_column("notes", "owner_id")
    op.drop_index(op.f("ix_users_id"), table_name="users")
    op.drop_index(op.f("ix_users_email"), table_name="users")
    op.drop_table("users")
