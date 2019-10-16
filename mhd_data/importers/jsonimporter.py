import json
from collections import deque

from .importer import DataImporter, ImporterError

from mhd_schema.models import Collection
from mhd_provenance.models import Provenance

class JSONFileImporter(DataImporter):
    """ An importer that loads data from a set of json files """

    def __init__(self, collection_slug, property_names, data_path, provenance_path, quiet, batch_size, inner_chunk_size = 1000000):
        # inner chunk size
        self._inner_chunk_size = inner_chunk_size

        # file list
        self._files = deque([])
        if isinstance(data_path, list) or isinstance(data_path, tuple):
            for d in data_path:
                self._files.append(d)
        else:
            self._files.append(data_path)

        # path to provenance
        self.provenance_path = provenance_path


        # buffer for current file chunk
        self._chunk = None
        self._chunk_fn = None
        self._chunk_offset = None


        # call super()
        collection = Collection.objects.get(slug=collection_slug)
        properties = [collection.get_property(pn) for pn in property_names]
        super().__init__(collection, properties, quiet, batch_size)

    def create_provenance(self):
        """ Creates the provenance model for this importer """

        with open(self.provenance_path) as f:
            prov = json.load(f)

        provenance = Provenance(metadata=prov)
        provenance.save()
        return provenance

    def get_next_chunk(self):
        """
            Gets the next chunk of items from the import source.
            Should return None if no more chunks are left.
        """

        # grab the next chunk (if we have nothing left)
        if self._chunk is None or len(self._chunk) == 0:
            self._chunk = self._get_next_chunk()

        # if there are no chunks left, return
        if self._chunk is None:
            return None

        # get meta data for the current chunk
        meta = {
            'filename': self._chunk_fn,
            'offset': self._chunk_offset
        }

        # cut the chunk to at most inner_chunk_size
        if len(self._chunk) > self._inner_chunk_size:
            c = self._chunk[:self._inner_chunk_size]
            self._chunk_offset += self._inner_chunk_size
            self._chunk = self._chunk[self._inner_chunk_size:]
        else:
            c = self._chunk
            self._chunk = None

        return {'data': c, 'meta': meta}

    def _get_next_chunk(self):
        """
            Loads the next file representing a chunk from disk.
        """

        # if we have no files left, bail
        if len(self._files) == 0:
            return None

        # get the next file path (and store the file path)
        data_path = self._files.popleft()
        self._chunk_fn = data_path
        self._chunk_offset = 0

        # read all of the data file
        with open(data_path) as f:
            try:
                data = json.load(f)
            except Exception as e:
                raise ImporterError('Unable to read file {}: {}'.format(data_path, str(e)))

        # if it is not a list, inform the user
        if not isinstance(data, list):
            raise ImporterError('Unable to import data from {}: Not a list. '.format(data_path))

        # return the data
        return data

    def get_chunk_column(self, chunk, property, idx):
        """
            Returns an iterator for the given property of the given chunk of data.
            Should contain get_chunk_length(chunk) elements.
            To be implemented by the subclass.
        """

        return [r[idx] for r in chunk['data']]

    def get_chunk_length(self, chunk):
        """
            Gets the length of the given chunk.
            By default¸ simply calls len() on the chunk object,
            but this may be overwritten by the subclass.
        """

        return len(chunk['data'])
