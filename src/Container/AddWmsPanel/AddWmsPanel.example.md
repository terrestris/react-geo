---
layout: basic.hbs
title: AddWmsPanel example
description: This example shows the usage of an AddWmsPanel.
collection: Examples
---

In this example layers of a WMS can be added to a map.
The capabilities of this WMS are fetched and parsed to OL layer instances using the `CapabilitiesUtil`.
An `AddWmsPanel` shows a list of the parsed layers and each checked layer (or the entire set) can be added to the map.
