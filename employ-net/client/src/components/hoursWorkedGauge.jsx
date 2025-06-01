import * as React from "react";
import Stack from "@mui/material/Stack";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

// Helper function to convert minutes to hours and minutes format
function formatHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return { hours, minutes };
}

export default function HoursWorkedGauge({ currMinutes, maxMinutes, heightOverride }) {
    currMinutes = Math.floor(currMinutes)
    // Convert current and maximum minutes to hours and minutes
    const { hours: currHours, minutes: currExtraMinutes } =
        formatHoursAndMinutes(currMinutes);
    const { hours: maxHours, minutes: maxExtraMinutes } =
        formatHoursAndMinutes(maxMinutes);

    return (
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 1, md: 3 }}
      >
        <Gauge
          width={200}
          height={heightOverride ? heightOverride : 190}
          value={currMinutes}
          valueMin={0}
          valueMax={maxMinutes}
          cornerRadius="50%"
          sx={(theme) => ({
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 20,
              transform: "translate(0px, 0px)",
            },
            [`& .${gaugeClasses.valueArc}`]: {
              fill: currMinutes >= maxMinutes ? "#52b202" : theme.palette.primary.main,
            },
            // [`& .${gaugeClasses.referenceArc}`]: {
            //   fill: theme.palette.text.disabled,
            // },
          })}
          
          text={({ value }) => {
            const { hours, minutes } = formatHoursAndMinutes(value);
            return `${hours}h ${minutes}m`;
          }}
        />
      </Stack>
    );
}
