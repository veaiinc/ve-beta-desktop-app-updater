import React from 'react';
import { createRoot } from 'react-dom/client';
import PermissionOverlay from './PermissionOverlay';

const container = document.getElementById('permission-root');
const root = createRoot(container);

root.render(<PermissionOverlay />);
