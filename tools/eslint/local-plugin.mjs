const INTERNAL_ORDER = ['state', 'custom', 'ref', 'memo', 'callback', 'handler', 'effect', 'layout', 'return'];

const HOOK_CATEGORY = {
    useState: 'state',
    useRef: 'ref',
    useMemo: 'memo',
    useCallback: 'callback',
    useEffect: 'effect',
    useLayoutEffect: 'layout'
};

function getCalleeName(callee) {
    if (callee?.type === 'Identifier') return callee.name;
    if (callee?.type === 'MemberExpression' && callee.property?.type === 'Identifier') {
        return callee.property.name;
    }
    return null;
}

function getHookCategoryByName(name) {
    if (!name?.startsWith('use')) return null;
    return HOOK_CATEGORY[name] ?? 'custom';
}

function isFunctionExpressionNode(node) {
    return node?.type === 'ArrowFunctionExpression' || node?.type === 'FunctionExpression';
}

function isHandleName(name) {
    return typeof name === 'string' && name.startsWith('handle');
}

function isComponentName(name) {
    return typeof name === 'string' && /^[A-Z]/.test(name);
}

function hasJsxReturn(body) {
    for (const statement of body.body) {
        if (statement.type !== 'ReturnStatement') continue;
        if (statement.argument?.type === 'JSXElement' || statement.argument?.type === 'JSXFragment') {
            return true;
        }
    }
    return false;
}

function getStatementCategory(statement) {
    if (statement.type === 'ReturnStatement') return 'return';

    if (statement.type === 'FunctionDeclaration') {
        if (isHandleName(statement.id?.name)) return 'handler';
        return null;
    }

    if (statement.type === 'ExpressionStatement' && statement.expression?.type === 'CallExpression') {
        return getHookCategoryByName(getCalleeName(statement.expression.callee));
    }

    if (statement.type !== 'VariableDeclaration') return null;

    for (const declarator of statement.declarations) {
        if (isHandleName(declarator.id?.name) && isFunctionExpressionNode(declarator.init)) {
            return 'handler';
        }
        if (declarator.init?.type === 'CallExpression') {
            const category = getHookCategoryByName(getCalleeName(declarator.init.callee));
            if (category) return category;
        }
    }
    return null;
}

function getComponentBody(node) {
    if (node.type === 'FunctionDeclaration' && isComponentName(node.id?.name) && node.body?.type === 'BlockStatement') {
        return node.body;
    }
    if (node.type === 'VariableDeclarator' && isComponentName(node.id?.name) && isFunctionExpressionNode(node.init)) {
        if (node.init.body?.type === 'BlockStatement') return node.init.body;
    }
    return null;
}

const localPlugin = {
    rules: {
        'component-internal-order': {
            meta: {
                type: 'suggestion',
                docs: {
                    description: 'Enforce internal order in React components'
                },
                schema: []
            },
            create(context) {
                function validateComponent(node) {
                    const body = getComponentBody(node);
                    if (!body || !hasJsxReturn(body)) return;

                    let maxSeenIndex = -1;
                    let maxSeenCategory = null;

                    for (const statement of body.body) {
                        const category = getStatementCategory(statement);
                        if (!category) continue;

                        const index = INTERNAL_ORDER.indexOf(category);
                        if (index === -1) continue;

                        if (index < maxSeenIndex) {
                            context.report({
                                node: statement,
                                message: `컴포넌트 내부 순서 위반: '${category}'는 '${maxSeenCategory}' 뒤에 위치해야 합니다.`
                            });
                            continue;
                        }

                        maxSeenIndex = index;
                        maxSeenCategory = category;
                    }
                }

                return {
                    FunctionDeclaration: validateComponent,
                    VariableDeclarator: validateComponent
                };
            }
        }
    }
};

export default localPlugin;
