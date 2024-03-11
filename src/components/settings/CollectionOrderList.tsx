import { useState, useContext, useCallback, useEffect } from "react";
import { DragDropContext, Draggable, DropResult } from "react-beautiful-dnd";
import Droppable from "../StrictModeDroppable";
import {
  DragHandle as DragHandleIcon,
  EditOutlined as EditOutlinedIcon,
} from "@mui/icons-material";
import { Box, IconButton, SxProps, Theme, Typography } from "@mui/material";
import AppContext from "../../AppContext";
import { reorder } from "../../utils";
import { useTranslation } from "react-i18next";
import { ManageMode } from "../../data";
import { RouteCollection } from "../../@types/types";

// mode: delete is for edit here
const CollectionOrderList = ({ mode }: { mode: ManageMode }) => {
  const { collections, setCollections, toggleCollectionDialog } =
    useContext(AppContext);
  const [items, setItems] = useState(
    // cannot use Array.reverse() as it is in-place reverse
    collections
  );
  const { t } = useTranslation();

  const handleDragEnd = useCallback(
    ({ destination, source }: DropResult) => {
      // dropped outside the list
      if (!destination) return;

      const newItems = reorder(items, source.index, destination.index);
      setCollections(newItems);
    },
    [items, setCollections]
  );

  const handleDelete = useCallback(
    (idx: number) => {
      toggleCollectionDialog(idx);
    },
    [toggleCollectionDialog]
  );

  useEffect(() => {
    setItems(collections);
  }, [collections]);

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="saved-eta-list">
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={containerSx}
          >
            {items.length ? (
              items.map((item, index) => (
                <DraggableListItem
                  item={item}
                  index={index}
                  key={`collection-${item.name}`}
                  mode={mode}
                  onDelete={() => handleDelete(index)}
                />
              ))
            ) : (
              <Typography sx={{ textAlign: "center", marginTop: 5 }}>
                <b>{t("未有收藏。")}</b>
              </Typography>
            )}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default CollectionOrderList;

interface DraggableListItemProps {
  item: RouteCollection;
  index: number;
  mode: ManageMode;
  onDelete: () => void;
}

const DraggableListItem = ({
  item: { name, list },
  index,
  mode,
  onDelete,
}: DraggableListItemProps) => {
  const { t } = useTranslation();
  return (
    <Draggable
      draggableId={name}
      index={index}
      isDragDisabled={mode !== "order"}
    >
      {(provided) => (
        <Box
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={entrySx}
        >
          <Box>
            <Typography variant="body1">{name}</Typography>
            <Typography variant="caption">
              {t("Number of ETAs: ")}
              {list.length}
            </Typography>
          </Box>
          {mode === "order" && <DragHandleIcon />}
          {mode === "delete" && (
            <IconButton onClick={onDelete}>
              <EditOutlinedIcon />
            </IconButton>
          )}
        </Box>
      )}
    </Draggable>
  );
};

const containerSx: SxProps<Theme> = {
  p: 1,
  overflowY: "scroll",
};

const entrySx: SxProps<Theme> = {
  px: 2,
  py: 1,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "2px 2px 2px 1px rgba(0, 0, 0, 0.1)",
};
