# Generated manually to match Django 5.2.16 migration style

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('newspapers', '0005_article_published_at'),
    ]

    operations = [
        migrations.AlterField(
            model_name='page',
            name='audio',
            field=models.URLField(blank=True, max_length=1000, null=True, verbose_name='Audio'),
        ),
    ]
