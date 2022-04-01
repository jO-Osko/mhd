import React from 'react';
import { MHDBackendClient, ResponseError } from "../../../src/client";

import type { GetServerSideProps } from 'next';
import { TMHDCollection } from "../../../src/client/rest";

import { Container, Alert } from "reactstrap";
import { MHDFilter, ParsedMHDCollection } from '../../../src/client/derived';
import ColumnEditor from '../../../src/components/routes/collection/search/columns/ColumnEditor'; // ../../../src/routes/search/columns/ColumnEditor
import FilterEditor from '../../../src/components/routes/collection/search/filter';
import ResultsTable from '../../../src/components/routes/collection/search/results/ResultsTable';
import { encodeState, decodeState, PageState } from '../../../src/state';
import { withRouter, NextRouter } from 'next/router'
import { TableState } from "../../../src/components/wrappers/table";
import { TMHDPreFilter } from "../../../src/client/rest";

interface MHDCollectionSearchProps{
    router: NextRouter;

    /** collection that was read */
    collection: TMHDCollection;

    /** timeout under which to not show the loading indicator */
    results_loading_delay: number;
}

interface MHDCollectionSearchState extends PageState {
    collection: ParsedMHDCollection;
}

/**
 * Display the search interface for a single collection
 */
class MHDCollectionSearch extends React.Component<MHDCollectionSearchProps, MHDCollectionSearchState> {

    state: MHDCollectionSearchState = ((): MHDCollectionSearchState => {
        // find the collection
        const collection = MHDBackendClient.getInstance().parseCollection(this.props.collection);

        // HACK: Decode the search state manually cause new URL() doesn't work
        let search = this.props.router.asPath;
        if (search.indexOf('?') != -1) {
            search = search.split('?')[1];
        } else {
            search = "";
        }

        const state = decodeState(search) ?? {
            filters: [],
            pre_filter: collection.defaultPreFilter,
            columns: collection.propertySlugs.slice(),
            page: 0,
            per_page: 20,
            widths: undefined,
        }

        // add the collection
        return { ...state, collection }
    })();

    private generateURLParams = ({collection, ...state}: MHDCollectionSearchState): string => {
        return encodeState(state);
    }

    /** called when new filters are set in the filter editor */
    private setFilters = (filters: MHDFilter[], pre_filter?: TMHDPreFilter) => {
        this.setState({ filters, pre_filter });
    }

    /** called when new columns are set in the column editor */
    private setColumns = (columns: string[]) => {
        this.setState({ columns });
    }

    /** called when the results state is updated */
    private setResultsState = ({ page, per_page, widths}: TableState) => {
        this.setState({ page, per_page, widths });
    }

    componentDidUpdate(prevProps: MHDCollectionSearchProps, prevState: MHDCollectionSearchState) {
        const oldParams = this.generateURLParams(prevState);
        const newParams = this.generateURLParams(this.state);
        if (oldParams !== newParams) {
            // TODO: This should be:
            // this.props.router.replace(`?${newParams}`);
            // but NextJS doesn't like that at all
            this.props.router.replace(`/collection/${this.state.collection.slug}?${newParams}`);
        }
    }

    render() {
        const { filters, pre_filter, columns, page, per_page, widths, collection } = this.state;
        const { results_loading_delay } = this.props;

        return (
            <main>
                {collection.flag_large_collection && <Alert color="warning">This collection is very large and queries might be slow. </Alert>}
                <FilterEditor
                    collection={collection}
                    filters={filters}
                    pre_filter={pre_filter}
                    onFilterApply={this.setFilters}
                    results_loading_delay={results_loading_delay}
                />
                <section>
                    <Container>
                        {
                            (filters !== null) && 
                            <ColumnEditor
                                collection={collection}
                                columns={columns}
                                onColumnsApply={this.setColumns}
                            />
                        }
                        {
                            (filters !== null) && (columns !== null) &&
                                <ResultsTable
                                    collection={collection}
                                    filters={filters}
                                    pre_filter={pre_filter}
                                    columns={columns}
                                    page={page}
                                    per_page={per_page}
                                    widths={widths}
                                    results_loading_delay={results_loading_delay}
                                    onStateUpdate={this.setResultsState}
                                />
                        }
                    </Container>
                </section>
            </main>
        );
    }

}

export default withRouter(MHDCollectionSearch);


export const getServerSideProps: GetServerSideProps = async function ({ params: { slug } }) {
    // TODO: Move client into a seperate page
    let collection: TMHDCollection;
    try {
        collection = await MHDBackendClient.getInstance().fetchCollection(slug as string);
    } catch(e) {
        if (!(e instanceof ResponseError) || !e.isNotFound) throw e;
        return { notFound: true};
    }

    return {
        props: { collection, results_loading_delay: 100 }, // will be passed to the page component as props
    }
}