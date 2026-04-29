type NodeState = {
    open: boolean;
    resolve: null | ((result: boolean) => void);
    data?: unknown;
};

type ConfirmStore = {
    node: { [name: string]: NodeState };
    confirm: (name: string, data?: unknown) => Promise<boolean>;
    onConfirm: (name: string, result: boolean) => void;
    close: (name: string) => void;
    closeAll: () => void;
};

const createConfirmStore = () => {
    let nodeState: { [name: string]: NodeState } = {};
    let snapshot: ConfirmStore | null = null;
    const listeners = new Set<() => void>();

    const notify = () => {
        snapshot = null;
        listeners.forEach((l) => l());
    };

    const confirm = (name: string, data?: unknown): Promise<boolean> =>
        new Promise((resolve) => {
            nodeState = { ...nodeState, [name]: { open: true, resolve, data } };
            notify();
        });

    const onConfirm = (name: string, result: boolean) => {
        nodeState[name]?.resolve?.(result);
        nodeState = { ...nodeState, [name]: { ...nodeState[name], resolve: null } };
        notify();
    };

    const close = (name: string) => {
        nodeState[name]?.resolve?.(false);
        nodeState = { ...nodeState, [name]: { open: false, resolve: null, data: undefined } };
        notify();
    };

    const closeAll = () => {
        Object.values(nodeState).forEach((n) => n.resolve?.(false));
        nodeState = {};
        notify();
    };

    const getSnapshot = (): ConfirmStore => {
        if (!snapshot) snapshot = { node: nodeState, confirm, onConfirm, close, closeAll };
        return snapshot;
    };

    return {
        subscribe: (listener: () => void) => {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        },
        getSnapshot
    };
};

const confirmStore = createConfirmStore();

export { confirmStore };

export type { ConfirmStore };
