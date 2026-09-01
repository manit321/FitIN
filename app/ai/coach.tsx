import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useFitness } from '../../context/FitnessContext';
import { Palette } from '../../constants/colors';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';
import { AIService, AIMessage } from '../../services/aiService';
import { calculateStreak } from '../../utils/calculations';

export default function AICoachScreen() {
  const router = useRouter();
  const { profile, loggedMeals, completedWorkouts } = useFitness();
  const flatListRef = useRef<FlatList>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = loggedMeals.filter((m) => m.date === todayStr);
  const loggedDates = Array.from(new Set(loggedMeals.map((m) => m.date)));
  const streak = calculateStreak(completedWorkouts, loggedDates);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `Hey ${profile.name.split(' ')[0]}! 👋 I'm your **APEX AI Coach**.\n\nI have analyzed your fitness profile (${profile.fitnessGoal.replace('_', ' ')}), your target of **${profile.targetCalories} kcal**, and your recent lifting sessions.\n\nWhat would you like to focus on today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const quickPrompts = [
    { label: '📊 Review My Macros', prompt: "How are my macros and calories tracking for today's goal?" },
    { label: '🏋️ Workout Advice', prompt: 'What progressive overload strategy should I use for my next workout?' },
    { label: '⚡ Break a Plateau', prompt: 'I feel like my weight and strength progress has plateaued. What should I change?' },
    { label: '🍗 High-Protein Meal Ideas', prompt: 'Give me 3 easy high-protein meal ideas that fit my daily target.' },
  ];

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isTyping) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setInputMessage('');

    const userMsg: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsTyping(true);

    const userContext = AIService.buildUserContext(
      profile,
      todayMeals,
      completedWorkouts,
      streak
    );

    const aiReply = await AIService.sendMessage(text, newMessages, userContext);

    const assistantMsg: AIMessage = {
      id: `ai-${Date.now()}`,
      role: 'assistant',
      content: aiReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setIsTyping(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, isTyping]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 8 : 0}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={Palette.textPrimary} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>APEX AI Coach</Text>
            <View style={styles.statusRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.statusText}>Live Context Synced</Text>
            </View>
          </View>

          <View style={styles.headerAvatar}>
            <Ionicons name="sparkles" size={18} color={Palette.primary} />
          </View>
        </View>

        {/* Quick Suggestion Chips */}
        <View style={styles.quickPromptsContainer}>
          <FlatList
            horizontal
            data={quickPrompts}
            keyExtractor={(_, idx) => String(idx)}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickPromptsList}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSend(item.prompt)}
                style={styles.quickChip}
                activeOpacity={0.8}
                disabled={isTyping}
              >
                <Text style={styles.quickChipText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isUser = item.role === 'user';
            return (
              <View
                style={[
                  styles.messageBubbleContainer,
                  isUser ? styles.userBubbleContainer : styles.aiBubbleContainer,
                ]}
              >
                {!isUser && (
                  <View style={styles.aiAvatar}>
                    <Ionicons name="sparkles" size={14} color={Palette.textInverse} />
                  </View>
                )}
                <View
                  style={[
                    styles.messageBubble,
                    isUser ? styles.userBubble : styles.aiBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      isUser ? styles.userMessageText : styles.aiMessageText,
                    ]}
                  >
                    {item.content}
                  </Text>
                  <Text
                    style={[
                      styles.messageTimestamp,
                      isUser ? styles.userTimestamp : styles.aiTimestamp,
                    ]}
                  >
                    {item.timestamp}
                  </Text>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingContainer}>
                <View style={styles.aiAvatar}>
                  <Ionicons name="sparkles" size={14} color={Palette.textInverse} />
                </View>
                <View style={styles.typingBubble}>
                  <ActivityIndicator size="small" color={Palette.primary} />
                  <Text style={styles.typingText}>Coach is analyzing your metrics...</Text>
                </View>
              </View>
            ) : null
          }
        />

        {/* Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.textInput}
            value={inputMessage}
            onChangeText={setInputMessage}
            placeholder="Ask your coach anything..."
            placeholderTextColor={Palette.textMuted}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            onPress={() => handleSend()}
            disabled={!inputMessage.trim() || isTyping}
            style={[
              styles.sendBtn,
              (!inputMessage.trim() || isTyping) && styles.sendBtnDisabled,
            ]}
            activeOpacity={0.8}
          >
            <Ionicons
              name="arrow-up"
              size={20}
              color={inputMessage.trim() ? Palette.textInverse : Palette.textMuted}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Palette.bgApp,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderColor: Palette.borderSubtle,
    backgroundColor: Palette.bgApp,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.bgCard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.body,
    fontWeight: Typography.fontWeights.bold,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Palette.primary,
  },
  statusText: {
    color: Palette.primary,
    fontSize: Typography.fontSizes.micro,
    fontWeight: Typography.fontWeights.semibold,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 245, 155, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickPromptsContainer: {
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  quickPromptsList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
  },
  quickChip: {
    backgroundColor: Palette.bgCard,
    borderRadius: BorderRadius.full,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  quickChipText: {
    color: Palette.textSecondary,
    fontSize: Typography.fontSizes.caption,
    fontWeight: Typography.fontWeights.medium,
  },
  messageList: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  messageBubbleContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.xs,
  },
  userBubbleContainer: {
    justifyContent: 'flex-end',
  },
  aiBubbleContainer: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  userBubble: {
    backgroundColor: Palette.primary,
    borderBottomRightRadius: 2,
  },
  aiBubble: {
    backgroundColor: Palette.bgCard,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: Typography.fontSizes.subhead,
    lineHeight: 21,
  },
  userMessageText: {
    color: Palette.textInverse,
    fontWeight: Typography.fontWeights.medium,
  },
  aiMessageText: {
    color: Palette.textPrimary,
  },
  messageTimestamp: {
    fontSize: Typography.fontSizes.micro,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  userTimestamp: {
    color: 'rgba(0, 0, 0, 0.5)',
  },
  aiTimestamp: {
    color: Palette.textMuted,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Palette.bgCard,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  typingText: {
    color: Palette.textMuted,
    fontSize: Typography.fontSizes.caption,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.bgCard,
    borderTopWidth: 1,
    borderColor: Palette.borderSubtle,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  textInput: {
    flex: 1,
    backgroundColor: Palette.bgInput,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    color: Palette.textPrimary,
    fontSize: Typography.fontSizes.subhead,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Palette.bgInput,
  },
});
