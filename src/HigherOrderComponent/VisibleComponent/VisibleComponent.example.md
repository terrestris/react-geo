---
layout: basic.hbs
title: VisibleComponent HOC example
description: This example shows the usage of the VisibleComponent HOC (High Order Component).
collection: Examples
---

This example shows the usage of the VisibleComponent HOC (High Order Component) to
determine the visibility of a component based on a `activeModules` property. Typically
this property is managed globally by `react-redux` (or similiar).

In the example below you see three components wrapped by the use of
`isVisibleComponent`. As the second one's name isn't listed in the activeModules,
it won't be rendered.
