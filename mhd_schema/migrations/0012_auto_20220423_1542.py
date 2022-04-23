# Generated by Django 3.2.12 on 2022-04-23 15:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('mhd_schema', '0011_auto_20220423_1524'),
    ]

    operations = [
        migrations.CreateModel(
            name='Exporter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('slug', models.SlugField(help_text='Slug of the exporter', unique=True)),
            ],
            options={
                'ordering': ['slug'],
            },
        ),
        migrations.AddField(
            model_name='collection',
            name='exporters',
            field=models.ManyToManyField(help_text='List of enabled exporters for this collection', to='mhd_schema.Exporter'),
        ),
    ]
