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
import { Alert, TouchableWithoutFeedback } from 'react-native';
import CommentImageContainer from '../UI/CommentImageContainer';
import ScreenLoader from '../ScreenLoader';
import { TEXT } from '../../i18n/locales/Text';
import GallaryIcon from '../../assets/svg/Group.svg';

interface Props {
  incidentId: number;
  userToken: string;
  userId: any;
}

const CommentSheet = forwardRef<any, Props>(
  ({ incidentId, userToken, userId }, ref) => {
    const { control, reset } = useForm();
    const [comment, setComment] = useState('');
    const [media, setMedia] = useState<any[]>([]);
    const mediaRef = useRef<any>(null);

    const [incidentStatus, setIncidentStatus] = useState<string>('');
    const [loading, setLoading] = useState(false);

    const [comments, setComments] = useState<any[]>([]);

    const [isEditing, setIsEditing] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(
      null,
    );

    const [selectedComment, setSelectedComment] = useState<any>(null);
    const [menuVisibleFor, setMenuVisibleFor] = useState<number | null>(null);

    useEffect(() => {
      if (!incidentId) return;

      setLoading(true);

      Promise.all([
        ApiManager.incidentDetails(incidentId, userToken),
        getComments(),
      ])
        .then(([incidentResp]) => {
          if (incidentResp?.data?.status) {
            setIncidentStatus(incidentResp.data.data.status);
          }
        })
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    }, [incidentId]);

    const getComments = async () => {
      try {
        const resp = await ApiManager.getComments(incidentId, userToken);

        if (resp?.data?.status) {
          setComments(resp.data.data);
        }
      } catch (error: any) {
        const message = error?.response?.data?.message;

        if (message === 'Comments not found') {
          // ✅ No comments → valid case
          setComments([]);
        } else {
          console.log('Get comments error:', error?.response);
        }
      }
    };

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
      'pending review',
      'pending response by responder',
      'pending closure by responder',
      'pending closure by admin',
      'pending log report review',
      'pending log report update',
    ];

    const canComment = ALLOWED_COMMENT_STATUSES.includes(
      incidentStatus.toLowerCase(),
    );

    const postComment = async () => {
      if (!comment.trim()) return;

      const formData = new FormData();

      formData.append('incident_id', String(incidentId));
      formData.append('user_id', String(userId));
      formData.append('comments', comment);
      formData.append(
        'comment_id',
        isEditing && editingCommentId ? String(editingCommentId) : '',
      );

      // ✅ append images correctly
      media.forEach((item, index) => {
        formData.append('upload_media[]', {
          uri: item.uri,
          name: item.name || `image_${index}.jpg`,
          type: item.type || 'image/jpeg',
        });
      });

      try {
        setLoading(true);

        const resp = await ApiManager.createComment(formData, userToken);

        if (resp?.data?.status) {
          setComment('');
          setMedia([]);
          setIsEditing(false);
          setEditingCommentId(null);
          reset();
          getComments(); // refresh list
        }
      } catch (err) {
        console.log('Create comment error', err);
      } finally {
        setLoading(false);
      }
    };

    const onEditPress = (item: any) => {
      setIsEditing(true);
      setEditingCommentId(item.comment_id);
      setComment(item.comments); // prefill text
      setMedia([]);
    };

    useEffect(() => {
      if (!selectedComment) return;

      Alert.alert(
        'Comment Options',
        '',
        [
          {
            text: 'Edit',
            onPress: () => {
              onEditPress(selectedComment);
              setSelectedComment(null);
            },
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              deleteComment(selectedComment.comment_id);
              setSelectedComment(null);
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
            onPress: () => setSelectedComment(null),
          },
        ],
        { cancelable: true },
      );
    }, [selectedComment]);

    const deleteComment = async (commentId: number) => {
      try {
        setLoading(true);

        const resp = await ApiManager.deleteCommentById(
          commentId,
          userId,
          userToken,
        );

        if (resp?.data?.status) {
          getComments(); // refresh list
        }
      } catch (error) {
        console.log('Delete comment error', error);
      } finally {
        setLoading(false);
      }
    };

    const timeAgo = (dateString: string) => {
      // Backend sends UTC but without timezone
      // Convert: "YYYY-MM-DD HH:mm:ss" → "YYYY-MM-DDTHH:mm:ssZ"
      const utcDate = new Date(dateString.replace(' ', 'T') + 'Z');

      const now = new Date();
      const diffMs = now.getTime() - utcDate.getTime();

      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes} min ago`;
      if (diffHours < 24) return `${diffHours} hr ago`;
      return `${diffDays} day ago`;
    };

    return (
      <RBSheet
        onClose={() => setMenuVisibleFor(null)}
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
            <Text style={styles.title}>{TEXT.comment()}</Text>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => (ref as any)?.current?.close()}
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>

          {!loading && comments.length === 0 && (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Text style={{ color: '#888' }}>No comments yet</Text>
            </View>
          )}

          {/* Comment List */}
          {loading ? (
            <ScreenLoader />
          ) : (
            <>
              <FlatList
                data={comments}
                keyExtractor={(item, index) =>
                  item?.comment_id
                    ? item.comment_id.toString()
                    : index.toString()
                }
                onScrollBeginDrag={() => setMenuVisibleFor(null)}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) => (
                  <View>
                    <View style={styles.commentCard}>
                      <View style={styles.commentHeader}>
                        <View
                          style={{
                            flexDirection: 'row',
                            gap: 10,
                          }}
                        >
                          <Text style={styles.name}>{item.user_name}</Text>
                          <Text style={styles.time}>
                            {timeAgo(item.date_reporting)}
                          </Text>
                        </View>

                        {item.user_id === userId && (
                          <TouchableOpacity
                            style={styles.dotsBtn}
                            onPress={() =>
                              setMenuVisibleFor(
                                menuVisibleFor === item.comment_id
                                  ? null
                                  : item.comment_id,
                              )
                            }
                          >
                            <Text style={styles.dots}>⋮</Text>
                          </TouchableOpacity>
                        )}

                        {menuVisibleFor === item.comment_id && (
                          <View
                            style={[
                              styles.menuContainer,
                              index >= comments.length - 2
                                ? { bottom: 28 } // ⬆️ open upward
                                : { top: 28 }, // ⬇️ open downward
                            ]}
                          >
                            <TouchableOpacity
                              style={styles.menuItem}
                              onPress={() => {
                                setMenuVisibleFor(null);
                                onEditPress(item);
                              }}
                            >
                              <Text style={styles.menuText}>Edit</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.menuItem}
                              onPress={() => {
                                setMenuVisibleFor(null);
                                deleteComment(item.comment_id);
                              }}
                            >
                              <Text style={[styles.menuText]}>Delete</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>

                      <Text style={styles.commentText}>{item.comments}</Text>

                      {item.media?.length > 0 && (
                        <View style={{ marginTop: 10 }}>
                          <CommentImageContainer
                            data={item.media.map((m: any) => ({
                              blob_url: m.media_url,
                            }))}
                          />
                        </View>
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

                  {isEditing && (
                    <TouchableOpacity
                      onPress={() => {
                        setIsEditing(false);
                        setEditingCommentId(null);
                        setComment('');
                        setMedia([]);
                      }}
                    >
                      <Text style={{ color: 'red', marginBottom: 10 }}>
                        Cancel Editing
                      </Text>
                    </TouchableOpacity>
                  )}

                  {/* Actions Row */}
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.uploadBtn]} // takes left space
                      onPress={() => mediaRef.current?.pickImages()}
                    >
                      <View style={styles.uploadContent}>
                        <GallaryIcon width={20} height={20} />
                        <Text style={styles.uploadText}>
                          {TEXT.upload_image()}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.sendBtn,

                        (!comment || loading) && { opacity: 0.5 },
                      ]}
                      disabled={!comment || loading}
                      onPress={postComment}
                    >
                      <Text style={styles.sendText}>
                        {loading
                          ? 'Posting...'
                          : isEditing
                          ? 'Update'
                          : 'Comment'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
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
    justifyContent: 'center',
    paddingBottom: 16,
    position: 'relative',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLOR.blue,
  },
  closeBtn: {
    position: 'absolute',
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
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
    fontSize: 14,
    textAlignVertical: 'center',
  },
  time: {
    fontSize: 12,
    color: '#888',
    textAlignVertical: 'center',
  },
  commentText: {
    fontSize: 14,
    color: COLOR.textGrey,

    lineHeight: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    minHeight: 70,

    padding: 10,
    textAlignVertical: 'top',
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
    alignItems: 'center',
    gap: 2, // ✅ THIS adds space between buttons

    justifyContent: 'space-between',
  },
  uploadBtn: {
    borderWidth: 1,
    borderColor: COLOR.blue,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
  },
  uploadText: {
    color: COLOR.blue,
    fontWeight: '600',
  },
  sendBtn: {
    backgroundColor: COLOR.blue,
    paddingVertical: 12,
    paddingHorizontal: 30, // 👈 reduced
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: '#fff',
    fontWeight: '700',
  },
  dots: {
    fontSize: 18,
    color: '#333',
  },
  commentCard: {
    paddingVertical: 12,
    position: 'relative',
  },

  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // 👈 change this
    marginBottom: 4,
  },
  dotsBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  menuContainer: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    zIndex: 1000,
    width: 120,
  },

  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
  },

  menuText: {
    fontSize: 14,
    color: '#333',
  },
  uploadContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
});
