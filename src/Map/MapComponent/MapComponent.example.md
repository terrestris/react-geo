---
layout: basic.html
title: MapComponent example
description: This example shows the usage of the MapComponent in combination with the MapProvider.
collection: Examples
---

This example shows the usage of the MapComponent in combination with the MapProvider.
It makes use of the `mappify` HOC function to supply the provided map to the MapComponent
and the NominatimSearch.

This way you can share the same mapobject across the whole application without passing
it as prop to the whole rendertree.

The map can be created asynchronusly so that every child of the MapProvider is just
rendered when the map is ready.
