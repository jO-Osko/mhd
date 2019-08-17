import React from 'react';
import { Col } from 'reactstrap';
import { MDHFilter, ParsedMDHCollection } from "../../../../../client/derived";
import Codec, { TValidationResult } from "../../../../../codecs/codec";
import { TMDHProperty } from "../../../../../client/rest";
import styles from './FilterSelector.module.css';

interface FilterSelectorProps {
    /** the current collection */
    collection: ParsedMDHCollection;

    /** callback when filters are applied  */
    onFilterUpdate: (filters: MDHFilter[]) => void;
}

interface FilterSelectorState {
    /** currently selected filters */
    selected: TFilter[];
}

interface TFilter {
    /** value of this filter */
    value: TFilterValue;
    
    /** unique id of this filter */
    uid: number;

    /** slug belonging to the property of this filter */
    slug: string;
}


/* * * * * * * * * * * * * * * * * * * * * * * * *
    Filter values
    - - - - - - - - - - - - - - - -
    null: filter selected, no valid value
    true/false: boolean values (default = true)
    /^(=|==|<=|>=|<|>|<>|!=)(\d+\.?\d*)$/
 * * * * * * * * * * * * * * * * * * * * * * * * */
type TFilterValue = string | null;

type TFilterAction = {
    action: "add",
    slug: string;
} | {
    action: "remove",
    i: number;
} | {
    action: "update",
    i: number,
    value: TFilterValue,
}

/**
 * Allows the user to select and edit filters. 
 * Notifies the parent via onFilterUpdate every time any change occurs. 
 */
 export default class FilterSelector extends React.Component<FilterSelectorProps, FilterSelectorState> {
    state: FilterSelectorState = {
        selected: [],
    }

    // number used for filter state
    private number = 0;
    
    /** updates the state of filters */
    private readonly handleFilterAction = (par: TFilterAction) => {
        // fetch a copy of the new filters
        const selected = this.state.selected.slice();

        // add a new element
        if (par.action === "add") {
            this.number++;
            selected.push({slug: par.slug, uid: this.number, value: null});
        
        // update the value of an existing element
        } else if(par.action === "update") {
            // we have to create a new value here
            // to ensure that the state is not mutated
            selected[par.i] = {
                ...selected[par.i],
                value: par.value,
            };
        
        // remove an element
        } else {
            selected.splice(par.i, 1);
        }

        // update the state and notify the parent
        this.setState({ selected });
        this.props.onFilterUpdate(selected);
    }


    
    /** renders the available filters */
    private renderAvailable() {
        const { collection: { properties } } = this.props;
        return(
            <div className={styles.searchFilter}>
                <div className={styles.filterBox}>
                    <ul className="fa-ul">
                        {properties.map((p) => 
                            <li key={p.slug}
                                onClick={() => this.handleFilterAction({action: "add", slug: p.slug})}>
                                <span className="fa-li"><i className="fas fa-plus"></i></span>
                                {p.displayName} <InfoButton value="filter" />
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        );
    }
    
    /** renders the selected filters */
    private renderSelected() {
        const { selected } = this.state;
        const { collection: { propMap, codecMap } } = this.props;

        return(
            <div className={styles.searchFilter}>
                <div className={styles.filterBox}>
                    {selected.length === 0 && <p className="text-center my-3">Select filters</p>}
                    <ul className="fa-ul">
                        {selected.map(({ slug, value, uid }, index) => (
                            <SelectedFilter key={uid}
                                property={propMap.get(slug)!}
                                codec={codecMap.get(slug)!}
                                value={value}
                                onApplyFilter={(v) => this.handleFilterAction({action: "update", i: index, value: v})}
                                onRemoveFilter={() => this.handleFilterAction({action: "remove", i: index})}/>
                        ))}
                    </ul>
                </div>
            </div>
        );
    }
    
    render() {
        return (
            <>
                <Col md="6" sm="12" className={`mx-auto my-4 ${styles.selectedFilters}`}>
                    {this.renderSelected()}
                </Col>
                <Col md="6" sm="12" className={`mx-auto my-4 ${styles.availableFilters}`}>
                    {this.renderAvailable()}
                </Col>
            </>
        );
    }
}

interface TSelectedFilterProps<S, T> {
    /** the schema of this filter */
    property: TMDHProperty;

    /** the values of this codec */
    codec: Codec<S, T>,

    /** the value of the selected filter */
    value: TFilterValue;

    /** callback when a value has been updated */
    onApplyFilter: (value: TFilterValue) => void;

    /** called when a filter is removed */
    onRemoveFilter: () => void;
}

interface TSelectedFilterState<T> {
    /** are we in edit mode? */
    edit: boolean;

    /** indicates if the current value is valid or not. */
    valid?: boolean;

    /** the value of a filter */
    internalValue: T;
}


class SelectedFilter<S = any, T = any> extends React.Component<TSelectedFilterProps<S, T>, TSelectedFilterState<T>> {

    state: TSelectedFilterState<T> = {
        edit: true,
        internalValue: this.props.codec.defaultFilterValue(),
    }
    
    editFilter = () => {
        this.setState({ edit: true, valid: true });
    }
    
    handleValueUpdate = (internalValue: T, surpressValidation?: boolean) => {
        // if we want to surpress validation
        if ( surpressValidation ) {
            this.setState({ internalValue, valid: undefined });
            return;
        }

        const { valid } = this.validateValue(internalValue);
        this.setState({ internalValue, valid });
    }

    /**
     * Validates the internal value of this result
     */
    validateValue = (internalValue: T): TValidationResult => {
        const { codec, value: lastValue } = this.props;
        
        // validate using the codec
        try {
            return codec.cleanFilterValue(internalValue, lastValue || undefined )
        } catch(e) {
            return { valid: false, message: (e || "").toString()};
        }
    }
    
    /**
     * Validates and applies the current internal value (iff it is valid)
     */
    handleApply = () => {
        const validationResult = this.validateValue(this.state.internalValue)
        
        // when valid update the parent
        if (validationResult.valid) {
            this.setState({ valid: true, edit: false });
            this.props.onApplyFilter(validationResult.value);

        // else mark as invalid
        } else {
            this.setState({ valid: false });
        }
    }

    componentDidMount() {
        this.handleValueUpdate(this.state.internalValue, false);
    }
    
    render() {
        const { edit, internalValue, valid } = this.state;
        const { onRemoveFilter, property: { displayName }, codec: { filterViewerComponent: FilterViewerComponent, filterEditorComponent: FilterEditorComponent } } = this.props;

        return(
            <li className={(edit ? styles.edit : "")}>
                {
                    edit ?
                        <FilterEditorComponent value={internalValue} valid={valid} onChange={this.handleValueUpdate} onApply={this.handleApply} codec={this.props.codec}>
                            <>
                                { displayName }
                                <InfoButton value="filter" />
                            </>
                        </FilterEditorComponent>
                        :
                        <FilterViewerComponent value={internalValue} codec={this.props.codec}>
                            <>
                                { displayName }
                                <InfoButton value="filter" />
                            </>
                        </FilterViewerComponent>
                }
                
                <span className="text-muted small">
                    <span className={styles.removeButton} onClick={onRemoveFilter}><i className="fas fa-minus"></i></span>
                    <span className={styles.doneButton} onClick={this.handleApply}><i className="fas fa-check"></i></span>
                    <span className={styles.editButton} onClick={this.editFilter}><i className="fas fa-pen"></i></span>
                </span>
            </li>
        );
    }
}

/**
 * A simple informational button
 */
export function InfoButton(props: {value: string}) {
    return(
        <a href="#!">
            <i className="far fa-question-circle" data-fa-transform="shrink-4 up-3"></i>
        </a>
    );
}