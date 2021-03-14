import { Icon, IconButton, ListItemText } from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { PageContentToolbar } from 'owp/components';
import { styles } from 'owp/components/Page/PageCarded';
import PropTypes from 'prop-types';
import React, { useState } from 'react';

const TreeGridToolbar = ({
    title,
    canAdd,
    canEdit,
    canDelete,
    classes,
    onAdd,
    onAddCopy,
    onEdit,
    onDelete,
    onShowSettings,
    onDownloadExcel,
    onSave,
    ...restProps
}) => {
    const [menuState, setMenuState] = useState({ open: false, anchorEl: null });

    return (
        <PageContentToolbar
            {...restProps}
            className={classes.toolbar}
            title={title}
            toolbarRight={
                <>
                    {canAdd && (
                        <IconButton onClick={onAdd} className="mr-8">
                            <Icon>add</Icon>
                        </IconButton>
                    )}
                    {/* {canAdd && <Button onClick={onAddCopy}>복사추가</Button>} */}
                    {canDelete && (
                        <IconButton onClick={onDelete} className="mr-8">
                            <Icon>delete</Icon>
                        </IconButton>
                    )}
                    {(canAdd || canEdit || canDelete) && (
                        <IconButton onClick={onSave} className="mr-8">
                            <Icon>save</Icon>
                        </IconButton>
                    )}

                    <IconButton
                        aria-label="More"
                        aria-haspopup="true"
                        onClick={(event) => {
                            setMenuState({
                                open: true,
                                anchorEl: event.currentTarget,
                            });
                        }}
                    >
                        <Icon>more_vert</Icon>
                    </IconButton>
                    <Menu
                        anchorEl={menuState.anchorEl}
                        open={menuState.open}
                        onClose={() => {
                            console.log('fff', menuState);
                            setMenuState({
                                open: false,
                            });
                        }}
                    >
                        <MenuItem
                            onClick={(event) => {
                                setMenuState({ open: false });
                                onShowSettings(event);
                            }}
                        >
                            <ListItemIcon>
                                <Icon>settings</Icon>
                            </ListItemIcon>
                            <ListItemText inset primary="설정" />
                        </MenuItem>
                        <MenuItem
                            onClick={(event) => {
                                setMenuState({ open: false });
                                onDownloadExcel(event);
                            }}
                        >
                            <ListItemIcon>
                                <Icon>save_alt</Icon>
                            </ListItemIcon>
                            <ListItemText inset primary="엑셀다운로드" />
                        </MenuItem>
                    </Menu>
                </>
            }
        />
    );
};

TreeGridToolbar.propTypes = {
    title: PropTypes.node,
    canAdd: PropTypes.bool,
    canEdit: PropTypes.bool,
    canDelete: PropTypes.bool,
    classes: PropTypes.object.isRequired,
    onAdd: PropTypes.func,
    onAddCopy: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
    onShowSettings: PropTypes.func,
    onDownloadExcel: PropTypes.func,
    onSave: PropTypes.func,
};

TreeGridToolbar.defaultProps = {
    canAdd: true,
    canEdit: true,
    canDelete: true,
    onAdd: () => {},
    onAddCopy: () => {},
    onEdit: () => {},
    onDelete: () => {},
    onShowSettings: () => {},
    onDownloadExcel: () => {},
    onSave: () => {},
};

export default withStyles(styles, { withTheme: true })(TreeGridToolbar);
