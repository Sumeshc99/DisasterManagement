import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLOR } from '../../themes/Colors';
import { FONT } from '../../themes/AppConst';
import { TEXT } from '../../i18n/locales/Text';

interface TableItem {
  name: string;
  number: string;
  type?: string;
}

interface Props {
  title: string;
  data: TableItem[];
}

const RevResTable: React.FC<Props> = ({ title, data }) => {
  if (!data || data.length === 0) return null;

  const isResponder = title === TEXT.responders() || title === 'Responder';

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.tableContainer}>
        {/* Header */}
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, { flex: 1 }]}>{TEXT.sr_no()}</Text>

          <Text style={[styles.cell, { flex: 2 }]}>{TEXT.full_name()}</Text>

          {isResponder && (
            <Text style={[styles.cell, { flex: 2 }]}>{TEXT.type()}</Text>
          )}

          <Text style={[styles.cell, { flex: 2 }]}>
            {TEXT.contact_details()}
          </Text>
        </View>

        {/* Rows */}
        {data.map((item, index) => (
          <View key={index} style={styles.row}>
            <Text style={[styles.cell, { flex: 1 }]}>{index + 1}</Text>

            <Text style={[styles.cell, { flex: 2 }]}>{item.name}</Text>

            {isResponder && (
              <Text style={[styles.cell, { flex: 2 }]}>{item.type || '-'}</Text>
            )}

            <Text style={[styles.cell, { flex: 2 }]}>{item.number}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RevResTable;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.textGrey,
    marginBottom: 10,
    fontFamily: FONT.R_BOLD_700,
  },

  tableContainer: {
    borderWidth: 1,
    borderColor: '#D3D3D3',
    borderRadius: 8,
    overflow: 'hidden',
  },

  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },

  headerRow: {
    backgroundColor: '#F5F5F5',
  },

  cell: {
    padding: 10,
    fontSize: 12,
    textAlign: 'center',
    color: COLOR.textGrey,
    fontFamily: FONT.R_REG_400,
  },
});
