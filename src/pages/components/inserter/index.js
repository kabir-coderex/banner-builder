import { __experimentalLibrary as Library } from '@wordpress/block-editor';



export function Inserter({ setIsInserterOpened }) {

    return (
        <div className="edit-post-editor__inserter-panel">
            <div className="edit-post-editor__inserter-panel-content">
                <Library
                    showMostUsedBlocks
                    showInserterHelpPanel={false}
                />
            </div>
        </div>
    );
}