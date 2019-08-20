from django.conf import settings
from django.http import HttpResponse
from django.views import View

from ..models import Item

from mdh_schema.models import Collection


class FrontendProxyView(View):
    def get(self, request, *args, **kwargs):
        found = self.is_found(request, *args, **kwargs)

        res = HttpResponse()
        res['X-Accel-Redirect'] = '/frontend/' if found else '/frontend/404/'

        # in debugging mode, print a message to show what is expected to happen
        if settings.DEBUG:
            res['Content-Type'] = 'text/html'
            status = 200 if found else 404
            res.write('X-Accel-Redirect {}<br/>(In production nginx will replace this by index.html with code {})'.format(
                res['X-Accel-Redirect'], status))

        return res

    def is_found(self, *args, **kwargs):
        """ Checks if a given item is found """
        raise NotImplementedError


class FrontendHomeView(FrontendProxyView):
    def is_found(self, *args, **kwargs):
        return True


class FrontendCollectionView(FrontendProxyView):
    def is_found(self, request, cid, **kwargs):
        return Collection.objects.filter(slug=cid).exists()


class FrontendItemView(FrontendProxyView):
    def is_found(self, request, uuid, **kwargs):
        try:
            return Item.objects.filter(id=uuid).exists()
        except:
            return False
