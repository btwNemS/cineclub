import React, { useEffect } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HeadingNode, QuoteNode, $createHeadingNode } from "@lexical/rich-text";
import {
  ListNode,
  ListItemNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { LinkNode } from "@lexical/link";
import { $setBlocksType } from "@lexical/selection";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $insertNodes,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
} from "lexical";
import { Box, ToggleButton, Divider, Stack } from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import LooksOneIcon from "@mui/icons-material/LooksOne";
import LooksTwoIcon from "@mui/icons-material/LooksTwo";
import NotesIcon from "@mui/icons-material/Notes";

const theme = {
  heading: {
    h1: "editor-h1",
    h2: "editor-h2",
  },
  list: {
    ul: "editor-ul",
    ol: "editor-ol",
  },
  text: {
    bold: "editor-bold",
    italic: "editor-italic",
    underline: "editor-underline",
  },
  link: "editor-link",
};

// Barre d'outils : agit sur l'éditeur via le contexte Lexical.
function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const formatText = (format) =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);

  const formatBlock = (createNode) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, createNode);
      }
    });
  };

  return (
    <Stack
      direction="row"
      spacing={0.5}
      sx={{
        p: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <ToggleButton value="bold" size="small" onClick={() => formatText("bold")}>
        <FormatBoldIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton value="italic" size="small" onClick={() => formatText("italic")}>
        <FormatItalicIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton value="underline" size="small" onClick={() => formatText("underline")}>
        <FormatUnderlinedIcon fontSize="small" />
      </ToggleButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <ToggleButton
        value="paragraph"
        size="small"
        onClick={() => formatBlock(() => $createParagraphNode())}
      >
        <NotesIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton
        value="h1"
        size="small"
        onClick={() => formatBlock(() => $createHeadingNode("h1"))}
      >
        <LooksOneIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton
        value="h2"
        size="small"
        onClick={() => formatBlock(() => $createHeadingNode("h2"))}
      >
        <LooksTwoIcon fontSize="small" />
      </ToggleButton>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      <ToggleButton
        value="ul"
        size="small"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)}
      >
        <FormatListBulletedIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton
        value="ol"
        size="small"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)}
      >
        <FormatListNumberedIcon fontSize="small" />
      </ToggleButton>
    </Stack>
  );
}

// Synchronise l'état "lecture seule" avec l'éditeur.
function EditablePlugin({ readOnly }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.setEditable(!readOnly);
  }, [editor, readOnly]);
  return null;
}

// Charge le HTML initial une seule fois au montage.
function InitialHtmlPlugin({ initialHtml }) {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    if (!initialHtml) return;
    editor.update(() => {
      const root = $getRoot();
      if (root.getFirstChild() !== null) return;
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHtml, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      root.clear();
      $getRoot().select();
      $insertNodes(nodes);
    });
    // On ne charge le HTML qu'au premier rendu.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);
  return null;
}

// Émet le contenu HTML courant à chaque modification.
function HtmlOnChangePlugin({ onChange }) {
  const [editor] = useLexicalComposerContext();
  if (!onChange) return null;
  return (
    <OnChangePlugin
      onChange={(_, editorInstance) => {
        editorInstance.read(() => {
          onChange($generateHtmlFromNodes(editorInstance, null));
        });
      }}
    />
  );
}

const Editor = ({
  initialHtml,
  onChange,
  readOnly = false,
  placeholder = "Saisissez votre texte…",
}) => {
  const initialConfig = {
    namespace: "cineclub-editor",
    theme,
    editable: !readOnly,
    onError(error) {
      console.error("Erreur de l'éditeur Lexical :", error);
    },
    nodes: [HeadingNode, QuoteNode, ListNode, ListItemNode, LinkNode],
  };

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        overflow: "hidden",
      }}
    >
      <LexicalComposer initialConfig={initialConfig}>
        {!readOnly && <Toolbar />}
        <Box sx={{ position: "relative" }}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                style={{
                  minHeight: 200,
                  padding: "12px 16px",
                  outline: "none",
                }}
              />
            }
            placeholder={
              <Box
                sx={{
                  position: "absolute",
                  top: 12,
                  left: 16,
                  color: "text.disabled",
                  pointerEvents: "none",
                }}
              >
                {placeholder}
              </Box>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </Box>
        <HistoryPlugin />
        <ListPlugin />
        <LinkPlugin />
        <EditablePlugin readOnly={readOnly} />
        <InitialHtmlPlugin initialHtml={initialHtml} />
        <HtmlOnChangePlugin onChange={onChange} />
      </LexicalComposer>
    </Box>
  );
};

export default Editor;
