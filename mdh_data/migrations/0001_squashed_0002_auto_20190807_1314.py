# Generated by Django 2.2.4 on 2019-08-16 13:54

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    replaces = [('mdh_data', '0001_initial'), ('mdh_data', '0002_auto_20190807_1314')]

    initial = True

    dependencies = [
        ('mdh_provenance', '0001_initial'),
        ('mhd_schema', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Item',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('collections', models.ManyToManyField(blank=True, help_text='Collection(s) each item occurs in', to='mhd_schema.Collection')),
            ],
        ),
        migrations.CreateModel(
            name='StandardBool',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('active', models.BooleanField(default=True, help_text='Is this item active')),
                ('value', models.BooleanField()),
                ('item', models.ForeignKey(help_text='Item this this cell represents', on_delete=django.db.models.deletion.CASCADE, to='mdh_data.Item')),
                ('prop', models.ForeignKey(help_text='Property this cell represents', on_delete=django.db.models.deletion.CASCADE, to='mhd_schema.Property')),
                ('provenance', models.ForeignKey(help_text='Provenance of this cell', on_delete=django.db.models.deletion.CASCADE, to='mdh_provenance.Provenance')),
                ('superseeded_by', models.ForeignKey(blank=True, help_text='Cell this value is superseeded by', null=True, on_delete=django.db.models.deletion.SET_NULL, to='mdh_data.StandardBool')),
            ],
            options={
                'abstract': False,
                'unique_together': {('item', 'prop', 'superseeded_by')},
            },
        ),
        migrations.CreateModel(
            name='StandardInt',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('active', models.BooleanField(default=True, help_text='Is this item active')),
                ('value', models.IntegerField()),
                ('item', models.ForeignKey(help_text='Item this this cell represents', on_delete=django.db.models.deletion.CASCADE, to='mdh_data.Item')),
                ('prop', models.ForeignKey(help_text='Property this cell represents', on_delete=django.db.models.deletion.CASCADE, to='mhd_schema.Property')),
                ('provenance', models.ForeignKey(help_text='Provenance of this cell', on_delete=django.db.models.deletion.CASCADE, to='mdh_provenance.Provenance')),
                ('superseeded_by', models.ForeignKey(blank=True, help_text='Cell this value is superseeded by', null=True, on_delete=django.db.models.deletion.SET_NULL, to='mdh_data.StandardInt')),
            ],
            options={
                'abstract': False,
                'unique_together': {('item', 'prop', 'superseeded_by')},
            },
        ),
    ]
