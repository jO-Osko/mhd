import React from "react"
import { Col } from "reactstrap"
import type { MHDFilter, ParsedMHDCollection } from "../../../client/derived"
import type { TValidationResult } from "../../../codecs/codec"
import type Codec from "../../../codecs/codec"
import type { TMHDProperty } from "../../../client/rest"
import styles from "./FilterSelector.module.css"
import PropertyInfoButton from "../../common/PropertyInfoButton"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus, faMinus, faCheck, faPen } from "@fortawesome/free-solid-svg-icons"

interface FilterSelectorProps {
    /** the current collection */
    collection: ParsedMHDCollection;
    
    /** the initially set filters */
    initialFilters: MHDFilter[];

    /** callback when filters are applied  */
    onFilterUpdate: (filters: MHDFilter[]) => void;
}

interface FilterSelectorState {
    /** currently selected filters */
    selected: TFilter[];
}

interface TFilter extends MHDFilter {
    /** unique id of this filter */
    uid: number;

    /** when set to true, this was an initial filter */
    initial: boolean;
}


/* * * * * * * * * * * * * * * * * * * * * * * * *
    Filter values
    - - - - - - - - - - - - - - - -
    null: filter selected, no valid value
    true/false: boolean values (default = true)
    /^(=|==|<=|>=|<|>|<>|!=)(\d+\.?\d*)$/
 * * * * * * * * * * * * * * * * * * * * * * * * */

type TFilterAction = {
    action: "add",
    slug: string;
} | {
    action: "remove",
    i: number;
} | {
    action: "update",
    i: number,
    value: TFilter["value"],
}

/**
 * Allows the user to select and edit filters. 
 * Notifies the parent via onFilterUpdate every time any change occurs. 
 */
 export default class FilterSelector extends React.Component<FilterSelectorProps, FilterSelectorState> {
    state: FilterSelectorState = {
        selected: this.props.initialFilters.map(({ slug, value }) => ({
            uid: (this.number++),
            initial: true,
            slug,
            value,
         })),
    }

    // number used for filter state
    private number = 0
    
    /** updates the state of filters */
    private readonly handleFilterAction = (par: TFilterAction) => {
        // fetch a copy of the new filters
        const selected = this.state.selected.slice()

        // add a new element
        if (par.action === "add") {
            this.number++
            selected.push({ slug: par.slug, uid: this.number, value: null, initial: false })
        
        // update the value of an existing element
        } else if(par.action === "update") {
            // we have to create a new value here
            // to ensure that the state is not mutated
            selected[par.i] = {
                ...selected[par.i],
                value: par.value,
            }
        
        // remove an element
        } else {
            selected.splice(par.i, 1)
        }

        // update the state and notify the parent
        this.setState({ selected })
        this.props.onFilterUpdate(selected)
    }


    
    /** renders the available filters */
    private renderAvailable() {
        const { collection: { properties, codecMap } } = this.props
        return(
            <div>
                <h5>Available conditions</h5>
                <div className={styles.searchFilter}>
                    <div className={styles.filterBox}>
                        <ul className="fa-ul">
                            {properties
                                .filter(p => !codecMap.get(p.slug).hiddenFromFilterList(p))
                                .map((p) => 
                                    <li key={p.slug}
                                        onClick={() => this.handleFilterAction({ action: "add", slug: p.slug })}>
                                        <FontAwesomeIcon icon={faPlus} listItem />
                                        {p.displayName} {<PropertyInfoButton prop={p} />}
                                    </li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
    
    /** renders the selected filters */
    private renderSelected() {
        const { selected } = this.state
        const { collection: { propMap, codecMap } } = this.props

        return(
            <div>
                <h5>Active conditions</h5>
                <div className={styles.searchFilter}>
                    <div className={styles.filterBox}>
                        {selected.length === 0 && <p className="text-center my-3">Select filters from the list on the left</p>}
                        <ul className="fa-ul">
                            {selected.map((filter, index) => (
                                <SelectedFilter key={filter.uid}
                                    property={propMap.get(filter.slug)!}
                                    codec={codecMap.get(filter.slug)!}
                                    filter={filter}
                                    onApplyFilter={(v) => this.handleFilterAction({ action: "update", i: index, value: v })}
                                    onRemoveFilter={() => this.handleFilterAction({ action: "remove", i: index })}/>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
    
    render() {
        return (
            <>
                <Col md="6" sm="12" className={`mx-auto my-4 ${styles.availableFilters}`}>
                    {this.renderAvailable()}
                </Col>
                <Col md="6" sm="12" className={`mx-auto my-4 ${styles.selectedFilters}`}>
                    {this.renderSelected()}
                </Col>
            </>
        )
    }
}

interface TSelectedFilterProps<S, T> {
    /** the schema of this filter */
    property: TMHDProperty;

    /** the values of this codec */
    codec: Codec<S, T>,

    /** the selected filter value */
    filter: TFilter;

    /** callback when a value has been updated */
    onApplyFilter: (value: TFilter["value"]) => void;

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
        edit: !this.props.filter.initial,
        internalValue: this.props.codec.parseFilterValue(this.props.filter.value),
    }
    
    editFilter = () => {
        this.setState({ edit: true, valid: true })
    }
    
    handleValueUpdate = (internalValue: T, surpressValidation?: boolean) => {
        // if we want to surpress validation
        if ( surpressValidation ) {
            this.setState({ internalValue, valid: undefined })
            return
        }

        const { valid } = this.validateValue(internalValue)
        this.setState({ internalValue, valid })
    }

    /**
     * Validates the internal value of this result
     */
    validateValue = (internalValue: T): TValidationResult => {
        const { codec, filter: { value: lastValue } } = this.props
        
        // validate using the codec
        try {
            return codec.cleanFilterValue(internalValue, lastValue || undefined )
        } catch(e: any) {
            return { valid: false, message: (e || "").toString() }
        }
    }
    
    /**
     * Validates and applies the current internal value (iff it is valid)
     */
    handleApply = () => {
        const validationResult = this.validateValue(this.state.internalValue)
        
        // when valid update the parent
        if (validationResult.valid) {
            this.setState({ valid: true, edit: false })
            this.props.onApplyFilter(validationResult.value)

        // else mark as invalid
        } else {
            this.setState({ valid: false })
        }
    }

    componentDidMount() {
        this.handleValueUpdate(this.state.internalValue, false)
    }
    
    render() {
        const { edit, internalValue, valid } = this.state
        const { onRemoveFilter, property: { displayName }, codec } = this.props

        const FilterViewerComponent = codec.filterViewerComponent()
        const FilterEditorComponent = codec.filterEditorComponent()

        return(
            <li className={(edit ? styles.edit : "")}>
                {
                    edit ?
                        <FilterEditorComponent value={internalValue} valid={valid} onChange={this.handleValueUpdate} onApply={this.handleApply} codec={this.props.codec}>
                            { displayName }
                        </FilterEditorComponent>
                        :
                        <FilterViewerComponent value={internalValue} codec={this.props.codec}>
                            { displayName }
                        </FilterViewerComponent>
                }
                
                <span className="text-muted small">
                    <span className={styles.removeButton} onClick={onRemoveFilter}><FontAwesomeIcon icon={faMinus} /></span>
                    <span className={styles.doneButton} onClick={this.handleApply}><FontAwesomeIcon icon={faCheck} /></span>
                    <span className={styles.editButton} onClick={this.editFilter}><FontAwesomeIcon icon={faPen} /></span>
                </span>
            </li>
        )
    }
}
