import { Chip, Tooltip } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import IAggregateData, {
  IAggregateEndpointInfo,
  IAggregateServiceInfo,
} from "../../entities/IAggregateData";
import IDisplayNodeInfo from "../../entities/IDisplayNodeInfo";
import IEndpointDataType from "../../entities/IEndpointDataType";
import DataService from "../../services/DataService";
import EndpointInfo from "./EndpointInfo";
import ServiceInfo from "./ServiceInfo";
import { makeStyles } from "@mui/styles";
import { Unsubscribe } from "../../services/DataView";

const useStyles = makeStyles(() => ({
  info: {
    margin: "0.5em 0",
    display: "flex",
    flexDirection: "row",
    gap: "0.2em",
  },
}));

export default function Description(props: { info: IDisplayNodeInfo | null }) {
  const classes = useStyles();
  const [serviceInfo, setServiceInfo] = useState<IAggregateServiceInfo[]>();
  const [endpointInfo, setEndpointInfo] = useState<IAggregateEndpointInfo>();
  const [endpointDataType, setEndpointDataType] = useState<IEndpointDataType>();
  const [aggDataSnap, setAggDataSnap] = useState<IAggregateData>();
  const combinedMap = useMemo(() => {
    const service = aggDataSnap?.services.find(
      (s) => s.uniqueServiceName === props.info?.uniqueServiceName
    );
    if (!service) return;
    const endpointMap = new Map<string, IAggregateEndpointInfo[]>();
    service.endpoints.forEach((e) => {
      endpointMap.set(
        e.labelName,
        (endpointMap.get(e.labelName) || []).concat([e])
      );
    });

    const combinedMap = new Map<string, IAggregateEndpointInfo>();
    [...endpointMap.entries()].map(([label, endpoints]) => {
      const combined = endpoints.reduce((prev, curr) => {
        prev.totalRequests += curr.totalRequests;
        prev.totalRequestErrors += curr.totalRequestErrors;
        prev.totalServerErrors += curr.totalServerErrors;
        prev.avgLatencyCV += curr.avgLatencyCV;
        return prev;
      });
      combinedMap.set(label, combined);
    });
    return combinedMap;
  }, [aggDataSnap]);

  useEffect(() => {
    const { info } = props;
    if (!info || info.type === "EX") return;
    const aggUnSub =
      DataService.getInstance().subscribeToAggregateData(setAggDataSnap);

    let dataTypeUnSub: Unsubscribe;
    if (info.type === "EP") {
      const uniqueLabelName = `${info.uniqueServiceName}\t${info.method}\t${info.labelName}`;
      dataTypeUnSub = DataService.getInstance().subscribeToEndpointDataType(
        setEndpointDataType,
        uniqueLabelName
      );
    }

    return () => {
      if (aggUnSub) aggUnSub();
      if (dataTypeUnSub) dataTypeUnSub();
    };
  }, [props.info]);

  useEffect(() => {
    const { info } = props;
    if (!info || info.type === "EX") return;
    if (info.type === "SRV") {
      setServiceInfo(
        aggDataSnap?.services.filter(
          (s) => s.service === info.service && s.namespace === info.namespace
        )
      );
    }
  }, [aggDataSnap, endpointDataType]);

  useEffect(() => {
    const { info } = props;
    if (!info) return;
    if (info.type === "EP") {
      setEndpointInfo(combinedMap?.get(info.labelName));
    }
  }, [combinedMap]);

  switch (props.info?.type) {
    case "SRV":
      return (
        <div>
          <div className={classes.info}>
            <Tooltip title="Namespace">
              <Chip color="success" size="small" label={props.info.namespace} />
            </Tooltip>
          </div>
          {serviceInfo ? <ServiceInfo services={serviceInfo} /> : null}
        </div>
      );
    case "EP":
      return (
        <div>
          <div className={classes.info}>
            <Tooltip title={`Namespace: ${props.info.namespace}`}>
              <Chip color="success" size="small" label={props.info.namespace} />
            </Tooltip>
            <Tooltip title={`Service: ${props.info.service}`}>
              <Chip color="info" size="small" label={props.info.service} />
            </Tooltip>
            <Tooltip title={`Version: ${props.info.version}`}>
              <Chip color="warning" size="small" label={props.info.version} />
            </Tooltip>
          </div>
          <EndpointInfo
            endpointInfo={endpointInfo}
            dataType={endpointDataType}
          />
        </div>
      );
    default:
      return <div></div>;
  }
}
