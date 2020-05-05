def _safe_call(f, *args, **kwargs):
    """ Safely calls a function and returns a pair (result, exception_or_None) """
    try:
        result = f(*args, **kwargs)
        return result, None
    except Exception as e:
        return None, e

class ChunkReader:
    def _count_chunks(self):
        """ Counts the number of available chunks """
        return None

    def _read_chunk(self):
        """ Loads the next chunk from the input data or returns None if no more chunks are available """
        raise NotImplementedError
    
    def _count_chunk_length(self, chunk):
        """ Reads the length of a chunk """
        raise NotImplementedError
    
    def _read_chunk_columns(self, chunk):
        """ Reads the columns of the given chunk """
        raise NotImplementedError
    
    def _read_chunk_props(self, chunk):
        """ Retruns the properties represented by the current chunk """
        raise NotImplementedError

    def _count_chunk_columns(self, chunk):
        """ Counts the number of columns in a chunk """
        raise NotImplementedError
    
    def _iterate_column(self, chunk, column):
        """ Iterates through the values in the column of a single chunk """

        raise NotImplementedError

class ImporterOutput:
    def _log_info(self, *args):
        raise NotImplementedError
    def _log_warn(self, *args):
        raise NotImplementedError
    def _log_error(self, *args):
        raise NotImplementedError
    def _create_progress_indicator(self, total, nested):
        """ Creates a new progress indicator of the given total (None if unknown)"""
        raise NotImplementedError
    def _update_progress_indiciator(self, indicator, num):
        """ Updates the given progress indicator to the new number """
        raise NotImplementedError
    def _close_progress_indicator(self, indicator):
        """ Closes the given progress indicator """
        raise NotImplementedError

class Importer(ChunkReader, ImporterOutput):
    def __call__(self):
        
        # get the total number of chunks and validate
        chunk_total, err = _safe_call(self._count_chunks)
        if err is not None:
            self._log_error("Error counting chunks".format(chunk_count), err)
            return err
        if chunk_total is not None and (not isinstance(chunk_total, int) or chunk_total < 0):
            self._log_warn("_count_chunks did not return a positive 'int' or 'None'")
            chunk_total = None
        if chunk_total is not None:
            self._log_info("Beginning chunk import process, expecting {} chunk(s)".format(chunk_total))
        else:
            self._log_info("Beginning chunk import process, expecting an unknown number of chunk(s)")
        
        # create a chunk indicator
        chunk_indicator = self._create_progress_indicator(chunk_total, False)
        chunk_count = 0

        def load_next_chunk():
            """ Utility function to load the next chunk """
            nonlocal chunk
            nonlocal chunk_count

            self._log_info("Trying to load chunk #{}".format(chunk_count))
            chunk, err = _safe_call(self._read_chunk)
            if err is not None:
                self._log_error("Error loading chunk #{}".format(chunk_count), err)
                self._close_progress_indicator(chunk_indicator)
                return err
            

            if chunk is not None:
                self._log_info("Successfully loaded chunk #{}".format(chunk_count))
            else:
                self._log_info("No more chunks available")

            return None
        
        # load the next chunk
        err = load_next_chunk()
        if err is not None:
            return err
        
        while chunk is not None:
            # update the chunk indicator
            self._update_progress_indiciator(chunk_indicator, chunk_count)

            # process this chunk
            err = self.__call_chunk(chunk)
            if err is not None:
                self._log_error("Error processing chunk #{}".format(chunk_count), err)
                self._close_progress_indicator(chunk_indicator)
                return err

            # load the next chunk
            chunk_count += 1
            err = load_next_chunk()
            if err is not None:
                return err
        
        # finialize
        self._close_progress_indicator(chunk_indicator)

        # if the chunk count is mismatched, raise an error
        if chunk_total is not None and chunk_count != chunk_total:
            self._log_warn("Chunk count mismatch: Expected {} but got {}".format(chunk_total, chunk_count))
        
        # and finish
        return None
    
    def __call__chunk(self, chunk):
        """ Imports a single chunk. Returns any error or None """

        # TODO: Write me