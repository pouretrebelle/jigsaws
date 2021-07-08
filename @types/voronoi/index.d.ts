/**
 * https://www.npmjs.com/package/voronoi
 * https://github.com/gorhill/Javascript-Voronoi
 */

declare module 'voronoi' {
  interface Point {
    x: number
    y: number
  }

  export type Site = Point & {
    voronoiId: number
  }

  export type Vertex = Point

  export interface Edge {
    lSite: Site
    rSite: Site
    va: Vertex
    vb: Vertex
  }

  export interface HalfEdge {
    site: Site
    edge: Edge
    angle: number
  }

  export interface Cell {
    site: Site
    halfedges: HalfEdge[]
  }

  export interface Diagram {
    vertices: Vertex[]
    edges: Edge[]
    cells: Cell[]
  }

  export interface BoundingBox {
    xl: number
    xr: number
    yt: number
    yb: number
  }

  class Voronoi {
    constructor()

    compute(sites: Point[], bbox: BoundingBox): Diagram
    recycle(diagram: Diagram): null
  }

  export default Voronoi
}
