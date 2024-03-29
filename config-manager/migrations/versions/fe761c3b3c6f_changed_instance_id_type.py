"""changed instance id type

Revision ID: fe761c3b3c6f
Revises: 923b6d257c8f
Create Date: 2021-09-28 22:38:47.840767

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "fe761c3b3c6f"
down_revision = "923b6d257c8f"
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("instance", schema=None) as batch_op:

        batch_op.alter_column(
            "id",
            existing_type=sa.INTEGER(),
            type_=sa.BigInteger(),
            existing_nullable=False,
        )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table("instance", schema=None) as batch_op:
        # batch_op.add_column(sa.Column('street', sa.String(length=50), nullable=True))
        batch_op.alter_column(
            "id",
            existing_type=sa.BigInteger(),
            type_=sa.INTEGER(),
            existing_nullable=False,
            autoincrement=True,
        )
    # ### end Alembic commands ###
