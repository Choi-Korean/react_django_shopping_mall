from django.conf import settings

from markets.models import Market


def gen_master(apps, schema_editor):
    if not settings.DEBUG:
        return

    Market(name="옷가게1", site_url="https://www.a1.co.kr", email="a1@test.com", master_id=2).save()
    Market(name="옷가게2", site_url="https://www.a2.co.kr", email="a2@test.com", master_id=3).save()
    Market(name="옷가게3", site_url="https://www.a3.co.kr", email="a3@test.com", master_id=4).save()
