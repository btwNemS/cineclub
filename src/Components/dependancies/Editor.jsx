import { useEffect, useState, useCallback, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  HorizontalRuleNode,
  INSERT_HORIZONTAL_RULE_COMMAND,
} from "@lexical/react/LexicalHorizontalRuleNode";
import {
  HeadingNode,
  QuoteNode,
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import {
  ListNode,
  ListItemNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_CHECK_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
} from "@lexical/list";
import { LinkNode, TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link";
import {
  $setBlocksType,
  $patchStyleText,
  $isAtNodeEnd,
} from "@lexical/selection";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import {
  mergeRegister,
  $getNearestNodeOfType,
  $findMatchingParent,
} from "@lexical/utils";
import {
  ELEMENT_TRANSFORMERS,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
} from "@lexical/markdown";
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $insertNodes,
  $createParagraphNode,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_CRITICAL,
} from "lexical";
import {
  Box,
  ToggleButton,
  Divider,
  Stack,
  Select,
  MenuItem,
  Tooltip,
  IconButton,
} from "@mui/material";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import CodeIcon from "@mui/icons-material/Code";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ChecklistIcon from "@mui/icons-material/Checklist";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import LinkOffIcon from "@mui/icons-material/LinkOff";
import HorizontalRuleIcon from "@mui/icons-material/HorizontalRule";
import FormatClearIcon from "@mui/icons-material/FormatClear";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import "./Editor.css";

const theme = {
  heading: {
    h1: "editor-h1",
    h2: "editor-h2",
    h3: "editor-h3",
  },
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  list: {
    ul: "editor-ul",
    ol: "editor-ol",
    listitem: "editor-listitem",
    nested: { listitem: "editor-nested-listitem" },
    listitemChecked: "editor-listitem-checked",
    listitemUnchecked: "editor-listitem-unchecked",
  },
  text: {
    bold: "editor-bold",
    italic: "editor-italic",
    underline: "editor-underline",
    strikethrough: "editor-strikethrough",
    underlineStrikethrough: "editor-underline-strikethrough",
    subscript: "editor-subscript",
    superscript: "editor-superscript",
    code: "editor-code",
  },
  link: "editor-link",
  hr: "editor-hr",
  hrSelected: "editor-hr selected",
};

// Transformeurs Markdown (raccourcis ## , - , 1. , **gras**, etc.)
// On exclut volontairement le bloc de code (CodeNode non enregistré).
const MARKDOWN_TRANSFORMERS = [
  ...ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];

const BLOCK_LABELS = {
  paragraph: "Paragraphe",
  h1: "Titre 1",
  h2: "Titre 2",
  h3: "Titre 3",
  quote: "Citation",
};

// Renvoie le nœud réellement sélectionné (gère les sélections multi-nœuds).
function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = anchor.getNode();
  const focusNode = focus.getNode();
  if (anchorNode === focusNode) return anchorNode;
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  }
  return $isAtNodeEnd(anchor) ? anchorNode : focusNode;
}

// Barre d'outils : agit sur l'éditeur via le contexte Lexical.
function Toolbar() {
  const [editor] = useLexicalComposerContext();

  const [blockType, setBlockType] = useState("paragraph");
  const [align, setAlign] = useState("left");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const textColorRef = useRef(null);
  const bgColorRef = useRef(null);

  // Lit l'état de la sélection courante pour mettre à jour les boutons actifs.
  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    setIsBold(selection.hasFormat("bold"));
    setIsItalic(selection.hasFormat("italic"));
    setIsUnderline(selection.hasFormat("underline"));
    setIsStrikethrough(selection.hasFormat("strikethrough"));
    setIsCode(selection.hasFormat("code"));

    const anchorNode = selection.anchor.getNode();
    let element =
      anchorNode.getKey() === "root"
        ? anchorNode
        : $findMatchingParent(anchorNode, (e) => {
            const parent = e.getParent();
            return parent !== null && $isRootOrShadowRoot(parent);
          });
    if (element === null) {
      element = anchorNode.getTopLevelElementOrThrow();
    }

    setAlign(element.getFormatType() || "left");

    if ($isListNode(element)) {
      const parentList = $getNearestNodeOfType(anchorNode, ListNode);
      const listType = parentList
        ? parentList.getListType()
        : element.getListType();
      setBlockType(
        listType === "check" ? "check" : listType === "number" ? "ol" : "ul"
      );
    } else if ($isHeadingNode(element)) {
      setBlockType(element.getTag());
    } else if (element.getType() === "quote") {
      setBlockType("quote");
    } else {
      setBlockType("paragraph");
    }

    const node = getSelectedNode(selection);
    const parent = node.getParent();
    setIsLink($isLinkNode(parent) || $isLinkNode(node));
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(updateToolbar);
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateToolbar]);

  const formatText = (format) =>
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);

  const setBlock = (createNode) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, createNode);
      }
    });
  };

  // Sélecteur de type de bloc (paragraphe / titres / citation).
  const handleBlockChange = (value) => {
    if (value === "paragraph") setBlock(() => $createParagraphNode());
    else if (value === "quote") setBlock(() => $createQuoteNode());
    else setBlock(() => $createHeadingNode(value)); // h1, h2, h3
  };

  // Bascule une liste : la retire si déjà active, sinon l'insère.
  const toggleList = (type) => {
    if (type === "ul") {
      blockType === "ul"
        ? editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        : editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else if (type === "ol") {
      blockType === "ol"
        ? editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        : editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else if (type === "check") {
      blockType === "check"
        ? editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined)
        : editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    }
  };

  const applyStyle = (styles) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, styles);
      }
    });
  };

  // Ajoute / retire un lien sur la sélection.
  const toggleLink = () => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      return;
    }
    const url = window.prompt("Adresse du lien :", "https://");
    if (url) editor.dispatchCommand(TOGGLE_LINK_COMMAND, url.trim());
  };

  // Réinitialise toute la mise en forme du texte sélectionné.
  const clearFormatting = () => {
    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) return;
      ["bold", "italic", "underline", "strikethrough", "code"].forEach((f) => {
        if (selection.hasFormat(f)) {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, f);
        }
      });
      $patchStyleText(selection, { color: null, "background-color": null });
      $setBlocksType(selection, () => $createParagraphNode());
    });
  };

  const btnSx = { border: "none", p: 0.75 };

  return (
    <Stack
      direction="row"
      spacing={0.25}
      sx={{
        p: 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        flexWrap: "wrap",
        alignItems: "center",
        rowGap: 0.5,
      }}
    >
      {/* Annuler / Rétablir */}
      <Tooltip title="Annuler (Ctrl+Z)">
        <span>
          <IconButton
            size="small"
            disabled={!canUndo}
            onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
          >
            <UndoIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
      <Tooltip title="Rétablir (Ctrl+Y)">
        <span>
          <IconButton
            size="small"
            disabled={!canRedo}
            onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
          >
            <RedoIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Type de bloc */}
      <Select
        size="small"
        value={
          ["ul", "ol", "check"].includes(blockType) ? "paragraph" : blockType
        }
        onChange={(e) => handleBlockChange(e.target.value)}
        sx={{ minWidth: 130, height: 34 }}
      >
        {Object.entries(BLOCK_LABELS).map(([value, label]) => (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        ))}
      </Select>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Mises en forme de texte */}
      <Tooltip title="Gras (Ctrl+B)">
        <ToggleButton
          value="bold"
          size="small"
          selected={isBold}
          onClick={() => formatText("bold")}
          sx={btnSx}
        >
          <FormatBoldIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Italique (Ctrl+I)">
        <ToggleButton
          value="italic"
          size="small"
          selected={isItalic}
          onClick={() => formatText("italic")}
          sx={btnSx}
        >
          <FormatItalicIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Souligné (Ctrl+U)">
        <ToggleButton
          value="underline"
          size="small"
          selected={isUnderline}
          onClick={() => formatText("underline")}
          sx={btnSx}
        >
          <FormatUnderlinedIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Barré">
        <ToggleButton
          value="strikethrough"
          size="small"
          selected={isStrikethrough}
          onClick={() => formatText("strikethrough")}
          sx={btnSx}
        >
          <StrikethroughSIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Code">
        <ToggleButton
          value="code"
          size="small"
          selected={isCode}
          onClick={() => formatText("code")}
          sx={btnSx}
        >
          <CodeIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>

      {/* Couleurs */}
      <Tooltip title="Couleur du texte">
        <IconButton
          size="small"
          onClick={() => textColorRef.current?.click()}
        >
          <FormatColorTextIcon fontSize="small" />
          <input
            ref={textColorRef}
            type="color"
            onChange={(e) => applyStyle({ color: e.target.value })}
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              opacity: 0,
              pointerEvents: "none",
            }}
          />
        </IconButton>
      </Tooltip>
      <Tooltip title="Couleur de surlignage">
        <IconButton size="small" onClick={() => bgColorRef.current?.click()}>
          <FormatColorFillIcon fontSize="small" />
          <input
            ref={bgColorRef}
            type="color"
            onChange={(e) =>
              applyStyle({ "background-color": e.target.value })
            }
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              opacity: 0,
              pointerEvents: "none",
            }}
          />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Listes */}
      <Tooltip title="Liste à puces">
        <ToggleButton
          value="ul"
          size="small"
          selected={blockType === "ul"}
          onClick={() => toggleList("ul")}
          sx={btnSx}
        >
          <FormatListBulletedIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Liste numérotée">
        <ToggleButton
          value="ol"
          size="small"
          selected={blockType === "ol"}
          onClick={() => toggleList("ol")}
          sx={btnSx}
        >
          <FormatListNumberedIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Liste de cases à cocher">
        <ToggleButton
          value="check"
          size="small"
          selected={blockType === "check"}
          onClick={() => toggleList("check")}
          sx={btnSx}
        >
          <ChecklistIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Alignements */}
      <Tooltip title="Aligner à gauche">
        <ToggleButton
          value="left"
          size="small"
          selected={align === "left" || align === ""}
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left")
          }
          sx={btnSx}
        >
          <FormatAlignLeftIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Centrer">
        <ToggleButton
          value="center"
          size="small"
          selected={align === "center"}
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center")
          }
          sx={btnSx}
        >
          <FormatAlignCenterIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Aligner à droite">
        <ToggleButton
          value="right"
          size="small"
          selected={align === "right"}
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right")
          }
          sx={btnSx}
        >
          <FormatAlignRightIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Justifier">
        <ToggleButton
          value="justify"
          size="small"
          selected={align === "justify"}
          onClick={() =>
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify")
          }
          sx={btnSx}
        >
          <FormatAlignJustifyIcon fontSize="small" />
        </ToggleButton>
      </Tooltip>

      <Tooltip title="Diminuer le retrait">
        <IconButton
          size="small"
          onClick={() =>
            editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined)
          }
        >
          <FormatIndentDecreaseIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Augmenter le retrait">
        <IconButton
          size="small"
          onClick={() =>
            editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined)
          }
        >
          <FormatIndentIncreaseIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

      {/* Insertions */}
      <Tooltip title={isLink ? "Retirer le lien" : "Insérer un lien"}>
        <ToggleButton
          value="link"
          size="small"
          selected={isLink}
          onClick={toggleLink}
          sx={btnSx}
        >
          {isLink ? (
            <LinkOffIcon fontSize="small" />
          ) : (
            <InsertLinkIcon fontSize="small" />
          )}
        </ToggleButton>
      </Tooltip>
      <Tooltip title="Trait horizontal">
        <IconButton
          size="small"
          onClick={() =>
            editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined)
          }
        >
          <HorizontalRuleIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Effacer la mise en forme">
        <IconButton size="small" onClick={clearFormatting}>
          <FormatClearIcon fontSize="small" />
        </IconButton>
      </Tooltip>
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

// Compteur de mots et de caractères affiché sous l'éditeur.
function StatusBar() {
  const [editor] = useLexicalComposerContext();
  const [stats, setStats] = useState({ words: 0, chars: 0 });

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const text = $getRoot().getTextContent();
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        setStats({ words, chars: text.length });
      });
    });
  }, [editor]);

  return (
    <Box
      sx={{
        px: 2,
        py: 0.75,
        borderTop: "1px solid",
        borderColor: "divider",
        fontSize: 12,
        color: "text.secondary",
        display: "flex",
        gap: 2,
      }}
    >
      <span>{stats.words} mots</span>
      <span>{stats.chars} caractères</span>
    </Box>
  );
}

const Editor = ({
  initialHtml,
  onChange,
  readOnly = false,
  placeholder = {},
}) => {
  const initialConfig = {
    namespace: "cineclub-editor",
    theme,
    editable: !readOnly,
    onError(error) {
      console.error("Erreur de l'éditeur Lexical :", error);
    },
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      LinkNode,
      HorizontalRuleNode,
    ],
  };

  return (
    <Box
      className="cineclub-editor-shell"
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
            contentEditable={<ContentEditable className="editor-content" />}
            placeholder={
              <Box
                sx={{
                  position: "absolute",
                  top: 14,
                  left: 18,
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
        <CheckListPlugin />
        <LinkPlugin />
        <HorizontalRulePlugin />
        <TabIndentationPlugin />
        <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
        <EditablePlugin readOnly={readOnly} />
        <InitialHtmlPlugin initialHtml={initialHtml} />
        <HtmlOnChangePlugin onChange={onChange} />
        {!readOnly && <StatusBar />}
      </LexicalComposer>
    </Box>
  );
};

export default Editor;
