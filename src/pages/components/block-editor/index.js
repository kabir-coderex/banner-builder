/**
 * WordPress dependencies
 */
import { parse, serialize } from "@wordpress/blocks";
import { Button, Popover } from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import "@wordpress/editor"; // This shouldn't be necessary
import { useEffect, useMemo, useState } from "@wordpress/element";
import "@wordpress/format-library";
import { uploadMedia } from "@wordpress/media-utils";

import PlusIcon from "../Icons/PlusIcon";

import {
  BlockEditorKeyboardShortcuts,
  BlockEditorProvider, BlockInspector, BlockList, BlockTools, ObserveTyping, WritingFlow
} from "@wordpress/block-editor";
/**
 * Internal dependencies
 */
import { ShortcutProvider } from "@wordpress/keyboard-shortcuts";
import { Inserter } from "../inserter";
import Sidebar from "../sidebar";

function BlockEditor({ settings: _settings, formBodyRes }) {
  const location = window.location.hash;
  var locationArray = location.split("/");
  const lastIndex = locationArray.at(-1);
  const id = lastIndex.replace("#", "");
  const [blocks, updateBlocks] = useState([]);
  const [showAll, updateShowAll] = useState(false);

  const canUserCreateMedia = useSelect((select) => {
    const _canUserCreateMedia = select("core").canUser("create", "media");
    return _canUserCreateMedia || _canUserCreateMedia !== false;
  }, []);


    const getFormData = async () => {
        let isMounted = true;
        if (id) {
            if (isMounted && 200 === formBodyRes?.code) {
                window.localStorage.setItem(
                    "getmrmblocks",
                    formBodyRes?.data[0]?.form_body
                );
                const storedBlocks = formBodyRes?.data[0]?.form_body;

                if (storedBlocks?.length) {
                handleUpdateBlocks(() => parse(storedBlocks));
                }
            } else {
                handleUpdateBlocks(() => parse(defaultData));
                window.localStorage.setItem("getmrmblocks", defaultData);
            }
        } else {
            handleUpdateBlocks(() => parse(defaultData));
            window.localStorage.setItem("getmrmblocks", defaultData);
        }
    };

  const defaultData = "<!-- wp:mrmformfield/email-field-block -->\n" +
	  "<div class=\"mrm-form-group mrm-input-group alignment-left email\" style=\"margin-bottom:12px ;width:100% ;max-width:px \"><label for=\"mrm-email\" style=\"color:#363B4E;margin-bottom:7px\"></label><div class=\"input-wrapper\"><input type=\"email\" name=\"email\" id=\"mrm-email\" placeholder=\"Email\" required style=\"background-color:#ffffff;color:#7A8B9A;font-size:14px;border-radius:5px;padding-top:11px;padding-right:14px;padding-bottom:11px;padding-left:14px;border-style:solid;border-width:1px;border-color:#DFE1E8\" pattern=\"[^@\\s]+@[^@\\s]+\\.[^@\\s]+\"/></div></div>\n" +
	  "<!-- /wp:mrmformfield/email-field-block -->\n" +
	  "\n" +
	  "<!-- wp:mrmformfield/mrm-button-block -->\n" +
	  "<div class=\"mrm-form-group submit\" style=\"margin-bottom:12px;text-align:left\"><button class=\"mrm-submit-button mintmrm-btn\" type=\"submit\" style=\"background-color:#573bff;color:;border-radius:5px;padding:15px 20px;line-height:1;letter-spacing:0;border-style:none;font-size:15px;border-width:0;border-color:;width:%\">Submit</button><div id=\"mint-google-recaptcha\" style=\"padding-top:10px;\"></div><div class=\"response\"></div></div>\n" +
	  "<!-- /wp:mrmformfield/mrm-button-block -->"

  const settings = useMemo(() => {
    if (!canUserCreateMedia) {
      return _settings;
    }
    return {
      ..._settings,
      mediaUpload({ onError, ...rest }) {
        uploadMedia({
          wpAllowedMimeTypes: _settings.allowedMimeTypes,
          onError: ({ message }) => onError(message),
          ...rest,
        });
      },
    };
  }, [canUserCreateMedia, _settings]);

  useEffect(() => {
    let isMounted = true;
    window.localStorage.setItem("mintFormChange", false);
    getFormData();
    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Wrapper for updating blocks. Required as `onInput` callback passed to
   * `BlockEditorProvider` is now called with more than 1 argument. Therefore
   * attempting to setState directly via `updateBlocks` will trigger an error
   * in React.
   */
  function handleUpdateBlocks(blocks) {
    updateBlocks(blocks);
    window.localStorage.setItem("mintFormChange", false);
  }
  function handleUpdateBlocksByOnInput(blocks) {
    updateBlocks(blocks);
    window.localStorage.setItem("getmrmblocks", serialize(blocks));
    window.localStorage.setItem("mintFormChange", true);
  }

  function handlePersistBlocks(newBlocks) {
    updateBlocks(newBlocks);
    window.localStorage.setItem("getmrmblocks", serialize(newBlocks));
    window.localStorage.setItem("mintFormChange", true);
  }
  function handleShowAll(){
    updateShowAll(!showAll)

  }
  return (
    <div className="get-mrm-block-editor">
      <Button
       className={showAll ? 'active' : '' }
       onClick={handleShowAll}>
        <PlusIcon />
      </Button>

      <ShortcutProvider>
        <BlockEditorProvider
          value={blocks}
          onInput={handleUpdateBlocksByOnInput}
          onChange={handlePersistBlocks}
          settings={settings}
        >
          <div className={showAll ? 'mrm-block-editor-wrapper show-all-block' : 'mrm-block-editor-wrapper' } >
            <div className="interface-interface-skeleton__secondary-sidebar">
              <Inserter setIsInserterOpened={true} />
            </div>

            <Sidebar.InspectorFill>
              <BlockInspector />
            </Sidebar.InspectorFill>

            <div className="editor-styles-wrapper">
              <BlockEditorKeyboardShortcuts />
              <BlockTools>
                <WritingFlow>
                  <ObserveTyping>
                    <BlockList className="get-mrm-block-editor__block-list" />
                  </ObserveTyping>
                </WritingFlow>
              </BlockTools>
              <Popover.Slot />
            </div>

          </div>

        </BlockEditorProvider>
      </ShortcutProvider>
    </div>
  );
}

export default BlockEditor;
