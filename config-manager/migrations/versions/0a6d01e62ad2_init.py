"""init

Revision ID: 0a6d01e62ad2
Revises: 
Create Date: 2021-09-09 19:03:48.686086

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0a6d01e62ad2'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('first_name', sa.String(length=64), nullable=False),
    sa.Column('last_name', sa.String(length=64), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=True),
    sa.Column('password', sa.String(length=128), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_table('cloud',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=256), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('config',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('_gateways', sa.String(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('config_cloud',
    sa.Column('config_id', sa.Integer(), nullable=False),
    sa.Column('cloud_id', sa.Integer(), nullable=False),
    sa.Column('is_deployed', sa.Boolean(), nullable=True),
    sa.ForeignKeyConstraint(['cloud_id'], ['cloud.id'], ),
    sa.ForeignKeyConstraint(['config_id'], ['config.id'], ),
    sa.PrimaryKeyConstraint('config_id', 'cloud_id')
    )
    op.create_table('endpoint',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('base_path', sa.String(length=128), nullable=False),
    sa.Column('endpoint_path', sa.String(length=128), nullable=False),
    sa.Column('method', sa.Enum('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD', 'CONNECT', 'TRACE', name='methods'), nullable=False),
    sa.Column('query_params', sa.PickleType(), nullable=True),
    sa.Column('path_params', sa.PickleType(), nullable=True),
    sa.Column('body_params', sa.PickleType(), nullable=True),
    sa.Column('security', sa.String(length=32), nullable=False),
    sa.Column('config_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['config_id'], ['config.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('instance',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=64), nullable=False),
    sa.Column('ip', sa.String(length=32), nullable=False),
    sa.Column('gateway', sa.String(length=32), nullable=False),
    sa.Column('config_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['config_id'], ['config.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('provider',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.Enum('GCP', 'AWS', 'AZURE', name='providers'), nullable=False),
    sa.Column('credentials', sa.PickleType(), nullable=False),
    sa.Column('region', sa.String(length=64), nullable=False),
    sa.Column('cloud_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['cloud_id'], ['cloud.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('test_file',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=128), nullable=False),
    sa.Column('content', sa.Text(), nullable=False),
    sa.Column('config_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['config_id'], ['config.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('test',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('is_finished', sa.Boolean(), nullable=True),
    sa.Column('config_id', sa.Integer(), nullable=True),
    sa.Column('test_file_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['config_id'], ['config.id'], ),
    sa.ForeignKeyConstraint(['test_file_id'], ['test_file.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('result',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('gateway', sa.String(length=32), nullable=False),
    sa.Column('score', sa.Integer(), nullable=False),
    sa.Column('metrics', sa.PickleType(), nullable=False),
    sa.Column('test_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['test_id'], ['test.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('result')
    op.drop_table('test')
    op.drop_table('test_file')
    op.drop_table('provider')
    op.drop_table('instance')
    op.drop_table('endpoint')
    op.drop_table('config_cloud')
    op.drop_table('config')
    op.drop_table('cloud')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    # ### end Alembic commands ###
