import React from "react"
import type { TValidationResult, TCellProps } from "../codec"
import Codec from "../codec"
import Sparse6toEdgeList from "./utils/Sparse6"
import D3ForceGraph from "../../components/wrappers/d3graph"

export default class GraphAsSparse6 extends Codec<string, null> {
    readonly slug: string = "GraphAsSparse6"
    readonly ordered: boolean | "+" | "-" = false

    readonly cellComponent = GraphAsSparse6Cell

    _filterViewerComponent = null
    _filterEditorComponent = null

    parseFilterValue(value: string | null) { return null }

    cleanFilterValue(value: null, lastValue?: string): TValidationResult {
        return { valid: false }
    }
}

class GraphAsSparse6Cell extends React.Component<TCellProps<GraphAsSparse6, string, null>> {
    static MAX_RENDER_ORDER = 20
    render() {
        const { value } = this.props
        if (value === null) return null

        // decode the graph
        const graph = Sparse6toEdgeList(value)
        if (graph === undefined) return null

        if(graph.nodes > GraphAsSparse6Cell.MAX_RENDER_ORDER) return `Graph with ${graph.nodes} nodes and ${2 * graph.edges.length} edges`
        
        return <D3ForceGraph strength={-50} style={{ width: 200, height: 200, innerNodeRadius: 1, outerNodeRadius: 5 }} graph={graph}/>
    }
}
