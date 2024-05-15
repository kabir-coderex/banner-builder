/**
 * WordPress dependencies
 */
import {
    Popover,
    SlotFillProvider
  } from "@wordpress/components";
  
  import { FullscreenMode, InterfaceSkeleton } from "@wordpress/interface";
  
  /**
   * Internal dependencies
   */
  import BlockEditor from "./components/block-editor";
  import Sidebar from "./components/sidebar";
  
  
  
  function Editor({ settings, formBodyRes }) {
    return (
      <div className="mrm-editor-builder">
          <FullscreenMode isActive={false} />
          <SlotFillProvider>
            <InterfaceSkeleton
              sidebar={<Sidebar />}
              content={
                <>
                  <BlockEditor settings={settings} formBodyRes={formBodyRes} />
                </>
              }
            />
  
            <Popover.Slot />
          </SlotFillProvider>
      </div>
    );
  }
  
  export default Editor;
  