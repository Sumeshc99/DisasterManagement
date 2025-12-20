import React, { forwardRef, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useForm } from 'react-hook-form';
import { COLOR } from '../../themes/Colors';
import ImageContainer from '../ImageContainer';
import CommentMediaPicker from '../inputs/CommentMediaPicker';
import ApiManager from '../../apis/ApiManager';

interface Props {
  incidentId: number;
  userToken: string;
}

const CommentSheet = forwardRef<RBSheet, Props>(
  ({ incidentId, userToken }, ref) => {
    const { control, reset } = useForm();
    const [comment, setComment] = useState('');
    const [media, setMedia] = useState<any[]>([]);
    const mediaRef = useRef<any>(null);

    const [incidentStatus, setIncidentStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (!incidentId) return;

      setLoading(true);
      ApiManager.incidentDetails(incidentId, userToken)
        .then(resp => {
          if (resp?.data?.status) {
            setIncidentStatus(resp.data.data.status);
          }
        })
        .catch(err => console.log('Incident details error', err))
        .finally(() => setLoading(false));
    }, [incidentId]);

    const ALLOWED_COMMENT_STATUSES = [
      'Pending Review',
      'Pending Response by Responder',
      'Pending Closure by Responder',
      'Pending Closure by Admin',
    ];

    const canComment = ALLOWED_COMMENT_STATUSES.includes(incidentStatus);

    const comments = [
      {
        id: 1,
        name: 'Vikas Kumar',
        time: '1 hour ago',
        text: 'My family member lives in the same area.',
        images: [],
      },
      {
        id: 2,
        name: 'Rakesh Kadke',
        time: '2 hours ago',
        text: 'Fire on the third floor.',
        images: [{ blob_url: 'https://via.placeholder.com/300' }],
      },
      {
        id: 2,
        name: 'Rakesh Kadke',
        time: '2 hours ago',
        text: 'Fire on the third floor.',
        images: [{ blob_url: 'https://via.placeholder.com/300' }],
      },
      {
        id: 2,
        name: 'Rakesh Kadke',
        time: '2 hours ago',
        text: 'Fire on the third floor.',
        images: [{ blob_url: 'https://via.placeholder.com/300' }],
      },
      {
        id: 2,
        name: 'Rakesh Kadke',
        time: '2 hours ago',
        text: 'Fire on the third floor.',
        images: [{ blob_url: 'https://via.placeholder.com/300' }],
      },
      {
        id: 2,
        name: 'Rakesh Kadke',
        time: '2 hours ago',
        text: 'Fire on the third floor.',
        images: [{ blob_url: 'https://via.placeholder.com/300' }],
      },
      {
        id: 2,
        name: 'Rakesh Kadke',
        time: '2 hours ago',
        text: 'Fire on the third floor.',
        images: [{ blob_url: 'https://via.placeholder.com/300' }],
      },
      {
        id: 2,
        name: 'Rakesh Kadke',
        time: '2 hours ago',
        text: 'Fire on the third floor.',
        images: [{ blob_url: 'https://via.placeholder.com/300' }],
      },
    ];

    const postComment = () => {
      if (!comment.trim()) return;

      console.log({
        incidentId,
        comment,
        media,
      });

      setComment('');
      setMedia([]);
      reset();
    };

    return (
      <RBSheet
        ref={ref}
        height={560}
        openDuration={250}
        customStyles={{
          wrapper: { backgroundColor: 'rgba(0,0,0,0.5)' },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
          },
        }}
      >
        <View style={{ flex: 1 }}>
          {/* Drag */}
          <View style={styles.dragIndicator} />

          {/* Header */}
          <View style={styles.header}>
            <View style={{ width: 30 }} />
            <Text style={styles.title}>Comments</Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => ref?.current?.close()}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Comment List */}
          <FlatList
            data={comments}
            inverted
            keyExtractor={item => item.id.toString()}
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View>
                <View style={styles.commentCard}>
                  <View style={styles.row}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.time}>{item.time}</Text>
                  </View>

                  <Text style={styles.commentText}>{item.text}</Text>

                  {item.images?.length > 0 && (
                    <ImageContainer data={item.images} />
                  )}
                </View>

                {/* Divider */}
                <View style={styles.divider} />
              </View>
            )}
          />

          {/* Input Area */}
          {canComment && (
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Enter comment"
                value={comment}
                onChangeText={setComment}
                style={styles.input}
                multiline
              />

              {/* Hidden Media Picker */}
              <CommentMediaPicker
                ref={mediaRef}
                media={media}
                onChange={setMedia}
              />

              {/* Actions Row */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.uploadBtn, { flex: 1, marginRight: 8 }]} // takes left space
                  onPress={() => mediaRef.current?.pickImages()}
                >
                  <Text style={styles.uploadText}>Upload Image</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sendBtn,
                    { flex: 1, marginLeft: 8 },
                    !comment && { opacity: 0.5 },
                  ]} // takes right space
                  disabled={!comment}
                  onPress={postComment}
                >
                  <Text style={styles.sendText}>Comment</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </RBSheet>
    );
  },
);

export default CommentSheet;

const styles = StyleSheet.create({
  dragIndicator: {
    alignSelf: 'center',
    width: 60,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.blue,
  },
  closeBtn: {
    width: 25,
    height: 25,
    borderRadius: 16,
    backgroundColor: COLOR.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  name: {
    fontWeight: '700',
    color: COLOR.blue,
  },
  time: {
    fontSize: 12,
    color: '#888',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderColor: '#eee',
    paddingTop: 10,
  },
  input: {
    minHeight: 70,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  uploadedImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between', // puts buttons on edges
    alignItems: 'center', // vertically center buttons
  },
  uploadBtn: {
    borderWidth: 1,
    borderColor: COLOR.blue,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  uploadText: {
    color: COLOR.blue,
    fontWeight: '600',
  },
  sendBtn: {
    backgroundColor: COLOR.blue,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: '700',
  },
});
