// @mui
import { alpha, styled } from '@mui/material/styles';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import ListItemButton from '@mui/material/ListItemButton';
//
import { NavItemProps, NavConfigProps } from '../types';

// ----------------------------------------------------------------------

type StyledItemProps = Omit<NavItemProps, 'item'> & {
  config: NavConfigProps;
};

const highlightColor = '#FFD700';

export const StyledItem = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})<StyledItemProps>(({ active, depth, config, theme }) => {
  const subItem = depth !== 1;

  const deepSubItem = depth > 2;

 const activeStyles = {
    root: {
      color: highlightColor, // chỉ đổi màu chữ và icon khi active
      '&:hover': {
        color: highlightColor,
        '& .MuiListItemIcon-root': {
          color: highlightColor,
        },
      },
      '& .MuiListItemIcon-root': {
        color: highlightColor,
      },
      backgroundColor: 'inherit', // giữ nguyên background
    },
    sub: {
      // color: theme.palette.action.disabled,
      color: 'white',
      backgroundColor: 'transparent',
      '&:hover': {
        backgroundColor: theme.palette.action.disabledOpacity,
      },
    },
  };

  return {
    // Root item
    padding: config.itemPadding,
    marginBottom: config.itemGap,
    borderRadius: config.itemRadius,
    minHeight: config.itemRootHeight,
    // color: theme.palette.text.secondary,
     color: 'white',

    // Active root item
    ...(active && {
      ...activeStyles.root,
    }),

    // Sub item
    ...(subItem && {
      minHeight: config.itemSubHeight,
      // Active sub item
      ...(active && {
        ...activeStyles.sub,
      }),
    }),

    // Deep sub item
    ...(deepSubItem && {
      paddingLeft: theme.spacing(depth),
    }),
  };
});

// ----------------------------------------------------------------------

type StyledIconProps = {
  size?: number;
};

export const StyledIcon = styled(ListItemIcon)<StyledIconProps>(({ size }) => ({
  width: size,
  height: size,
  alignItems: 'center',
  justifyContent: 'center',
}));

type StyledDotIconProps = {
  active?: boolean;
};

export const StyledDotIcon = styled('span')<StyledDotIconProps>(({ active, theme }) => ({
  width: 4,
  height: 4,
  borderRadius: '50%',
   backgroundColor: active ? highlightColor : "white",
  transition: theme.transitions.create(['transform'], {
    duration: theme.transitions.duration.shorter,
  }),
  ...(active && {
    transform: 'scale(2)',
    // backgroundColor: theme.palette.action.selected,
  }),
}));

// ----------------------------------------------------------------------

type StyledSubheaderProps = {
  config: NavConfigProps;
};

export const StyledSubheader = styled(ListSubheader)<StyledSubheaderProps>(({ config, theme }) => ({
  ...theme.typography.overline,
  fontSize: 11,
  cursor: 'pointer',
  display: 'inline-flex',
  padding: config.itemPadding,
  paddingTop: theme.spacing(2),
  marginBottom: config.itemGap,
  paddingBottom: theme.spacing(1),
  // color: theme.palette.text.disabled,
  color: 'white', 
  transition: theme.transitions.create(['color'], {
    duration: theme.transitions.duration.shortest,
  }),
  // '&:hover': {
  //   color: theme.palette.text.primary,
  // },
  '&:hover': {
    color: 'white', // ✅ Giữ nguyên màu khi hover
  },
}));
