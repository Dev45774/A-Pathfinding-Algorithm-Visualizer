import Node from "./Node";

const Grid = ({ mouseIsDown, setMouseIsDown, grid, setGrid }) => {
  return (
    <>
      {grid && (
        <div className="grid bg-white">
          {grid.map((nodes) => {
            return (
              <div className="row">
                {" "}
                {nodes.map((node, i) => {
                  return (
                    <Node
                      mouseIsDown={mouseIsDown}
                      setMouseIsDown={setMouseIsDown}
                      grid={grid}
                      setGrid={setGrid}
                      key={i}
                      node={node}
                    />
                  );
                })}{" "}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default Grid;
