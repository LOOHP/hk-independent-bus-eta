import React, { useContext } from "react";
import { Box, Paper, SxProps, Theme, Typography } from "@mui/material";
import RouteNo from "../route-board/RouteNo";
import { toProperCase, langSpace } from "../../utils";
import { useTranslation } from "react-i18next";
import AppContext from "../../AppContext";
import ReverseButton from "./ReverseButton";
import TimetableButton from "./TimeTableButton";
import RouteStarButton from "./RouteStarButton";

const RouteHeader = ({ routeId }: { routeId: string }) => {
  const { t, i18n } = useTranslation();
  const {
    db: { routeList },
  } = useContext(AppContext);
  const { route, orig, dest, nlbId } = routeList[routeId];

  return (
    <Paper id="route-eta-header" sx={PaperSx} elevation={0}>
      <RouteNo routeNo={route} component="h1" align="center" />
      <Typography component="h2" variant="caption" align="center">
        {t("往")}{langSpace(i18n)}{toProperCase(dest[i18n.language])}{" "}
        {nlbId ? t("從") + toProperCase(orig[i18n.language]) + t("開出") : ""}
      </Typography>
      <ReverseButton routeId={routeId} />
      <Box sx={rightBtnGroupSx}>
        <RouteStarButton routeId={routeId} />
        <TimetableButton routeId={routeId} />
      </Box>
    </Paper>
  );
};

export default RouteHeader;

const PaperSx: SxProps<Theme> = {
  textAlign: "center",
  background: "transparent",
  position: "relative",
};

const rightBtnGroupSx: SxProps<Theme> = {
  position: "absolute",
  top: "0",
  right: "2%",
};
