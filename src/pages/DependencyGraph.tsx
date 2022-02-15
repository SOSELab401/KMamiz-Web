import { makeStyles } from "@mui/styles";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import { MockGraphData } from "../classes/MockData";
import { DependencyGraphFactory } from "../classes/DependencyGraphFactory";
import {
  useHoverHighlight,
  DependencyGraphUtils,
} from "../classes/DependencyGraphUtils";
import InformationWindow from "../components/InformationWindow";
import IDisplayNodeInfo from "../entities/IDisplayNodeInfo";
import ViewportUtils from "../classes/ViewportUtils";

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
    height: "calc(100vh - 64px)",
    overflow: "hidden",
  },
}));

export default function DependencyGraph() {
  const classes = useStyles();
  const graphRef = useRef<any>();
  const [size, setSize] = useState([0, 0]);
  const [data, setData] = useState<any>();
  const [highlightInfo, setHighlightInfo] = useHoverHighlight();
  const [displayInfo, setDisplayInfo] = useState<IDisplayNodeInfo | null>(null);

  useLayoutEffect(() => {
    const unsubscribe = ViewportUtils.getInstance().subscribe(([vw, vh]) =>
      setSize([vw, vh])
    );
    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log(highlightInfo);
    // TODO: change to api call after backend is ready
    const rawData = MockGraphData;
    // make sure data is newly created and not shared
    const d = JSON.parse(JSON.stringify(rawData));
    setData(DependencyGraphUtils.ProcessData(d));
    setTimeout(() => {
      graphRef.current.zoom(4, 0);
    }, 10);
  }, []);

  return (
    <div className={classes.root}>
      <div>
        <ForceGraph2D
          ref={graphRef}
          width={size[0]}
          height={size[1]}
          graphData={data}
          {...DependencyGraphFactory.Create(
            highlightInfo,
            setHighlightInfo,
            graphRef,
            setDisplayInfo
          )}
        />
      </div>
      <InformationWindow info={displayInfo} />
    </div>
  );
}
