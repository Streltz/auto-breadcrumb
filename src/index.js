/* @flow */
import React from 'react';
import { Link } from 'react-router-dom';
import findNameByPath from './pathToName';
import type { ConfigType } from '$define';

type props = {
  pathname: string
};

const defaultItemRender = (name, path) =>
  <Link to={path}>
    {name}
  </Link>;

const Breadcrumbs = ({
  staticRoutesMap = {},
  dynamicRoutesMap = {},
  homePath = '/',
  containerProps = {},
  itemProps = {},
  Breadcrumb = 'ul',
  BreadcrumbItem = 'li',
  itemRender = defaultItemRender,
  notFound = '404 NotFound',
}: ConfigType) => ({ pathname }: props) => {
  if (typeof pathname !== 'string') {
    throw new Error('Breadcrumbs must set string props "pathname"');
  }
  if (!staticRoutesMap[homePath]) {
    staticRoutesMap[homePath] = 'Home';
  }
  const paths = homePath === '/' ? [homePath] : [];
  if (pathname !== homePath || homePath !== '/') {
    pathname.split('/').reduce((prev, curr, index) => {
      paths[index] = `${prev}/${curr}`;
      return paths[index];
    });
  }
  const lastIndex = paths.length - 1;
  let BreadcrumbItems = [];
  paths.every((path, index) => {
    const hasNames = findNameByPath(path, {
      staticRoutesMap,
      dynamicRoutesMap,
    });

    const names = hasNames || notFound;

    const isExact = lastIndex === index || !hasNames;
    if (Array.isArray(names)) {
      const subLastIndex = names.length - 1;
      BreadcrumbItems = BreadcrumbItems.concat(
        names.map((name, subIndex) =>
          <BreadcrumbItem {...itemProps} key={`${index}.${subIndex}`}>
            {subLastIndex !== subIndex || isExact ? name : itemRender(name, path)}
          </BreadcrumbItem>
        )
      );
    } else {
      const name = isExact ? names : itemRender(names, path);
      BreadcrumbItems = BreadcrumbItems.concat(
        <BreadcrumbItem {...itemProps} key={index}>
          {name}
        </BreadcrumbItem>
      );
    }

    return hasNames;
  });
  return (
    <Breadcrumb {...containerProps}>
      {BreadcrumbItems}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
