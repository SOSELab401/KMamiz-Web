import { IconButton, Tooltip } from "@mui/material";
import { Article } from "@mui/icons-material";
import { IAggregateServiceInfo } from "../../entities/IAggregateData";
import { useNavigate } from "react-router-dom";

function roundNumber(num: number) {
  return Math.round(num * 10000) / 10000;
}
function sumField(field: string, obj: any[]) {
  return obj.reduce((prev, s: any) => prev + s[field], 0);
}

export default function ServiceInfo(props: {
  services: IAggregateServiceInfo[];
}) {
  const navigate = useNavigate();
  props.services.sort((a, b) => a.version.localeCompare(b.version));

  const endpoints = [
    ...new Set<string>(
      props.services
        .map((s) => s.endpoints.map((e) => ({ ...e, version: s.version })))
        .flat()
        .map((e) => `${e.version}\t${e.method}\t${e.labelName}`)
    ),
  ].length;
  return (
    <div>
      Detail:
      <ul>
        <li>Endpoints: {endpoints}</li>
        <li>Requests: {sumField("totalRequests", props.services)}</li>
        <li>4XX Errors: {sumField("totalRequestErrors", props.services)}</li>
        <li>5XX Errors: {sumField("totalServerErrors", props.services)}</li>
        <li>
          Combined Risk:{" "}
          {roundNumber(
            sumField("avgRisk", props.services) / props.services.length
          )}
        </li>
        <li>
          Active Versions:
          <ul>
            {props.services.map((s) => (
              <li key={s.version}>
                {s.version}
                <Tooltip title="Open SwaggerUI">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      navigate(
                        `/swagger/${encodeURIComponent(s.uniqueServiceName)}`
                      );
                    }}
                  >
                    <Article />
                  </IconButton>
                </Tooltip>
              </li>
            ))}
          </ul>
        </li>
        <li>
          Risk Per Version:
          <ul>
            {props.services.map((s) => (
              <li key={s.version}>
                {s.version}: {roundNumber(s.avgRisk)}
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}
