import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import { Canvas, ImageSize } from "mirador";
import { useTranslation } from "react-i18next";

import ImageLink from "./ImageLink";

interface CanvasDownloadLinksProps {
  canvas: Canvas;
  label: number | string;
  maxDownloadWidth?: number | null;
  sizes?: ImageSize[];
}

const CanvasDownloadLinks = ({
  canvas,
  label,
  maxDownloadWidth,
  sizes = [],
}: CanvasDownloadLinksProps) => {
  const { t } = useTranslation();
  return (
    <Card className="mb-3" raised>
      <CardContent>
        <Typography
          component="h5"
          style={{ textTransform: "none" }}
          variant="h6"
        >
          <Box fontWeight="fontWeightBold">{`${t("image")}: ${label}`}</Box>
        </Typography>
        <List>
          {sizes
            .sort((a, b) => b.width - a.width)
            .slice(1)
            .reduce(
              (acc: { height: number; width: number }[], { height, width }) => {
                // Initialize from the largest allowed available size when max width is set.
                if (acc.length === 0) {
                  if (maxDownloadWidth == null || width <= maxDownloadWidth) {
                    acc.push({ height, width });
                  } else {
                    acc.push({
                      height: calculateHeight(maxDownloadWidth, canvas),
                      width: maxDownloadWidth,
                    });
                  }
                  // Once initialized, only keep sizes at least 500px apart.
                } else if (acc[acc.length - 1].width - width >= 500) {
                  if (maxDownloadWidth == null || width <= maxDownloadWidth) {
                    acc.push({ height, width });
                  }
                }
                return acc;
              },
              maxDownloadWidth == null
                ? [{ height: canvas.getHeight(), width: canvas.getWidth() }]
                : [],
            )
            .map(({ height, width }) => (
              <ListItem dense key={`${height}x${width}`}>
                <ImageLink
                  height={height}
                  linkTarget={canvas.getCanonicalImageUri(width)}
                  width={width}
                />
              </ListItem>
            ))}
        </List>
      </CardContent>
    </Card>
  );
};

// function for calculating the image height given a width, and the full height and width of the canvas
const calculateHeight = (width: number, canvas: Canvas) => {
  const aspectRatio = canvas.getWidth() / canvas.getHeight();
  return Math.round(width / aspectRatio);
};

export default CanvasDownloadLinks;
