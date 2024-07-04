import './PropertyGrid.less';

import {
  horizontalListSortingStrategy,
  SortableContext,
  useSortable,
} from '@dnd-kit/sortable';

import { closestCenter, DndContext, DragOverlay, PointerSensor, useSensor, useSensors, type DragEndEvent, type DragOverEvent, type UniqueIdentifier } from '@dnd-kit/core';

import { Table } from 'antd';
import { TableProps } from 'antd/lib/table';
import _get from 'lodash/get';
import { getUid } from 'ol';
import OlFeature from 'ol/Feature';
import OlGeometry from 'ol/geom/Geometry';
import React, {
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react';

import { CSS_PREFIX } from '../../constants';
import { arrayMove } from '@dnd-kit/sortable';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';

type AttributeNames = {
  [key: string]: string;
};

interface OwnProps {
  /**
   * Title of the attribute name column
   */
  attributeNameColumnTitle?: string;
  /**
   * Value in percent representing the width of the attribute name column
   * The width of the attribute value column will be calculated based on this
   */
  attributeNameColumnWidthInPercent?: number;
  /**
   * Title of the attribute value column
   */
  attributeValueColumnTitle?: string;
  /**
   * A CSS class which should be added.
   */
  className?: string;
  /**
   * Array of attribute names to filter
   */
  attributeFilter?: string[];
  /**
   * Object containing a mapping of attribute names in OL feature to custom ones
   */
  attributeNames?: AttributeNames;
  /**
   * Feature for which the properties should be shown
   */
  feature: OlFeature<OlGeometry>;
}

interface HeaderCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  id: string;
}

interface BodyCellProps extends React.HTMLAttributes<HTMLTableCellElement> {
  id: string;
}

interface DragIndexState {
  active: UniqueIdentifier;
  over: UniqueIdentifier | undefined;
  direction?: 'left' | 'right';
}

export type PropertyGridProps<T = any> = OwnProps & TableProps<T>;

const defaultClassName = `${CSS_PREFIX}propertygrid`;

const DragIndexContext = createContext<DragIndexState>({ active: -1, over: -1 });

const dragActiveStyle = (dragState: DragIndexState, id: string) => {
  const { active, over, direction } = dragState;
  // drag active style
  let style: React.CSSProperties = {};
  if (active && active === id) {
    style = { backgroundColor: 'gray', opacity: 0.5 };
  }
  // dragover dashed style
  else if (over && id === over && active !== over) {
    style =
      direction === 'right'
        ? { borderRight: '1px dashed gray' }
        : { borderLeft: '1px dashed gray' };
  }
  return style;
};

const TableBodyCell: React.FC<BodyCellProps> = (props) => {
  const dragState = useContext<DragIndexState>(DragIndexContext);
  return <td {...props} style={{ ...props.style, ...dragActiveStyle(dragState, props.id) }} />;
};

const TableHeaderCell: React.FC<HeaderCellProps> = (props) => {
  const dragState = useContext(DragIndexContext);
  const { attributes, listeners, setNodeRef, isDragging } = useSortable({ id: props.id });
  const style: React.CSSProperties = {
    ...props.style,
    cursor: 'move',
    ...(isDragging ? { position: 'relative', zIndex: 9999, userSelect: 'none' } : {}),
    ...dragActiveStyle(dragState, props.id),
  };
  return <th {...props} ref={setNodeRef} style={style} {...attributes} {...listeners} />;
};

/**
 * Component representing a feature grid showing the attribute values of a simple feature.
*/
const PropertyGrid: React.FC<PropertyGridProps> = ({
  attributeNameColumnTitle = 'Attribute name',
  attributeNameColumnWidthInPercent = 50,
  attributeValueColumnTitle = 'Attribute value',
  className,
  attributeFilter,
  attributeNames,
  feature,
  ...passThroughProps
}) => {

  const baseColumns = useMemo(() => {
    return [{
      title: attributeNameColumnTitle,
      dataIndex: 'attributeName',
      key: 'attributeName',
      width: `${attributeNameColumnWidthInPercent}%`
    }, {
      title: attributeValueColumnTitle,
      dataIndex: 'attributeValue',
      key: 'attributeValue',
      width: `${100 - attributeNameColumnWidthInPercent}%`,
      render: (value: any) => {
        if (isUrl(value)) {
          return <a href={value} target="_blank">{value}</a>;
        } else {
          return value;
        }
      }
    }];
  }, [attributeNameColumnTitle, attributeNameColumnWidthInPercent, attributeValueColumnTitle]);

  const [dragIndex, setDragIndex] = useState<DragIndexState>({ active: -1, over: -1 });
  const [columns, setColumns] = useState(() =>
    baseColumns.map((column, i) => ({
      ...column,
      key: `${i}`,
      onHeaderCell: () => ({ id: `${i}` }),
      onCell: () => ({ id: `${i}` }),
    })),
  );

  const isUrl = (value: string) => {
    return /^(?:\w+:)?\/\/([^\s.]+\.\S{2}|localhost[:?\d]*)\S*$/.test(value);
  };

  const dataSource = useMemo(() => {
    let filter = attributeFilter;

    if (!filter) {
      filter = feature.getKeys().filter((attrName: string) => attrName !== 'geometry');
    }

    return filter.map((attr: any) => {
      const fid = getUid(feature);

      return {
        attributeName: (attributeNames && _get(attributeNames, attr)) ?
          _get(attributeNames, attr) :
          attr,
        attributeValue: feature.get(attr),
        key: `ATTR_${attr}_fid_${fid}`
      };
    });
  }, [attributeFilter, attributeNames, feature]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        // https://docs.dndkit.com/api-documentation/sensors/pointer#activation-constraints
        distance: 1,
      },
    }),
  );

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      setColumns((prevState) => {
        const activeIndex = prevState.findIndex((i) => i.key === active?.id);
        const overIndex = prevState.findIndex((i) => i.key === over?.id);
        return arrayMove(prevState, activeIndex, overIndex);
      });
    }
    setDragIndex({ active: -1, over: -1 });
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    const activeIndex = columns.findIndex((i) => i.key === active.id);
    const overIndex = columns.findIndex((i) => i.key === over?.id);
    setDragIndex({
      active: active.id,
      over: over?.id,
      direction: overIndex > activeIndex ? 'right' : 'left',
    });
  };

  const finalClassName = className
  ? `${className} ${defaultClassName}`
  : defaultClassName;

  return (
    <DndContext
    sensors={sensors}
      modifiers={[restrictToHorizontalAxis]}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      collisionDetection={closestCenter}
    >
      <SortableContext items={columns.map((i) => i.key)} strategy={horizontalListSortingStrategy}>
        <DragIndexContext.Provider value={dragIndex}>
          <Table
            className={finalClassName}
            rowKey={record => record.key}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
            components={{
              header: { cell: TableHeaderCell },
              body: { cell: TableBodyCell },
            }}
            {...passThroughProps}
          />
        </DragIndexContext.Provider>
      </SortableContext>
      <DragOverlay>
        <th style={{ backgroundColor: 'gray', padding: 16 }}>
          {columns[columns.findIndex((i) => i.key === dragIndex.active)]?.title as React.ReactNode}
        </th>
      </DragOverlay>
    </DndContext>
  );
};

export default PropertyGrid;
