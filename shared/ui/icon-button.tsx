import type { ComponentProps } from 'react';

import { IconButton as HbdsIconButton } from '@/hbds/display/icon-button';

import { Icon, type IconName } from './icon';

type IconButtonProps = ComponentProps<typeof HbdsIconButton> & {
    name: IconName;
    size?: number;
    iconStroke?: number;
};

export const IconButton = ({ name, size = 22, iconStroke, ...props }: IconButtonProps) => (
    <HbdsIconButton {...props}>
        <Icon name={name} size={size} stroke={iconStroke} />
    </HbdsIconButton>
);
