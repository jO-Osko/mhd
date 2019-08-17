# Generated by Django 2.2.4 on 2019-08-17 11:17

from django.db import migrations, models
import mdh_data.fields.json


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DumbJSONFieldModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', mdh_data.fields.json.DumbJSONField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='SmartJSONFieldModel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', mdh_data.fields.json.SmartJSONField(null=True)),
            ],
        ),
    ]
