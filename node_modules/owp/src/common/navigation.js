import { clone } from 'ramda';

function traverseNav(navs, loc, parent, result) {
    if (navs && navs.length) {
        for (const nav of navs) {
            nav.parent = parent;

            if (nav.url === loc.pathname) {
                result = nav;

                return result;
            } else {
                result = traverseNav(nav.children, loc, nav, result);
            }
        }
    }

    return result;
}

function flattenNav(nav, arr = []) {
    if (!nav) {
        return;
    }

    if (nav.parent) {
        flattenNav(nav.parent, arr);
    }

    arr.push(nav);

    return arr;
}

export function getFlatNavigation(navigationItems, flatNavigation) {
    flatNavigation = flatNavigation ? flatNavigation : [];
    for (const navItem of navigationItems) {
        if (navItem.type === 'subheader') {
            continue;
        }

        if (navItem.type === 'item') {
            flatNavigation.push({ ...navItem });

            continue;
        }

        if (navItem.type === 'collapse' || navItem.type === 'group') {
            if (navItem.children) {
                getFlatNavigation(navItem.children, flatNavigation);
            }
        }
    }

    return flatNavigation;
}

export function getPath(navs, loc) {
    return flattenNav(traverseNav(clone(navs), loc)) || [];
}
