import React from 'react';
import Codec, { TCellProps, TValidationResult } from '../codec';

export default class ListAsArray<T> extends Codec<Array<T>, null> {
    constructor(public elementCodec: Codec<T, any>) {
        super();
        this.slug = `ListAsArray_${elementCodec.slug}`;
    }
    readonly slug: string;

    readonly cellComponent = ListAsArrayCell;

    _filterViewerComponent = null;
    _filterEditorComponent = null;

    defaultFilterValue() {
        return null;
    }

    cleanFilterValue(value: null, lastValue?: string): TValidationResult {
        return { valid: false, message: 'Filtering for MatrixAsList not supported'};
    }
}

class ListAsArrayCell<T> extends React.Component<TCellProps<ListAsArray<T>, Array<T>, null>> {
    render() {
        const { value } = this.props;
        if (value === null) return null;
        

        // TODO: for now
        return <>
            {JSON.stringify(value)}
        </>;
    }
}