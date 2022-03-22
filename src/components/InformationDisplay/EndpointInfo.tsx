import { Card } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { TAggregateEndpointInfo } from "../../entities/TAggregateData";
import IEndpointDataType from "../../entities/TEndpointDataType";
import CodeDisplay from "../CodeDisplay";
import RequestDonutChart from "../RequestDonutChart";

const useStyles = makeStyles(() => ({
  code: {
    fontFamily: "monospace",
    overflow: "auto",
    padding: "0 1em",
    backgroundColor: "#262335",
    color: "white",
  },
}));

export default function EndpointInfo(props: {
  endpointInfo?: TAggregateEndpointInfo;
  dataType?: IEndpointDataType;
}) {
  const classes = useStyles();
  const { endpointInfo, dataType } = props;
  if (!endpointInfo) return <div></div>;
  const resSchema =
    dataType?.schemas[dataType?.schemas.length - 1].responseSchema;
  const reqSchema =
    dataType?.schemas[dataType?.schemas.length - 1].requestSchema;

  const {
    totalRequests,
    totalRequestErrors: reqErrors,
    totalServerErrors: srvErrors,
  } = endpointInfo;

  return (
    <div>
      <Card variant="outlined">
        <RequestDonutChart
          series={[totalRequests - reqErrors - srvErrors, reqErrors, srvErrors]}
        />
      </Card>
      {reqSchema ? (
        <div>
          <h4>Request Schema (Typescript)</h4>
          <CodeDisplay code={reqSchema} />
        </div>
      ) : null}
      {resSchema ? (
        <div>
          <h4>Response Schema (Typescript)</h4>
          <CodeDisplay code={resSchema} />
        </div>
      ) : null}
    </div>
  );
}
