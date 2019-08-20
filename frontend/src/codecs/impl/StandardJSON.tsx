import React from 'react';
import Codec, { TCellProps, TValidationResult } from '../codec';

export default class StandardJSON extends Codec<any, null> {
    readonly slug: string = "StandardJSON";

    readonly cellComponent = StandardJSONCell;

    _filterViewerComponent = null;
    _filterEditorComponent = null;

    defaultFilterValue() {
        return null;
    }

    cleanFilterValue(value: null, lastValue?: string): TValidationResult {
        return { valid: false };
    }
}

class StandardJSONCell extends React.Component<TCellProps<StandardJSON, any, null>> {
    render() {
        const { value } = this.props;
        if (value === null) return null;
        
        
        return JSON.stringify(value);
    }
}