import { Child } from './types';

export interface ChildData {
  home: {
    focusTitle: string;
    focusDescription: string;
    focusAction: string;
    timeline: {
      now: { title: string; meta: string; content: string };
      next: { title: string; meta: string; content: string };
      later: { title: string; meta: string; content: string };
    };
    emerging: { title: string; description: string };
  };
  understanding: {
    description: string;
    focusAreas: { title: string; description: string; sources: string[] }[];
  };
  priorities: {
    description: string;
  };
}

export const getChildData = (child: Child): ChildData => {
  if (child.name === 'Liam') {
    return {
      home: {
        focusTitle: 'Quarter plan complete',
        focusDescription: 'Liam has achieved the goals for this quarter. The next Now, Next, and Later order will be set with the clinician after the next review session.',
        focusAction: 'Prepare for the next review',
        timeline: {
          now: { title: 'This quarter is complete', meta: '100% achieved · Maintenance active', content: 'Liam has met the current plan goals. Keep the working routines steady while the review evidence is brought together.' },
          next: { title: 'Next review session', meta: '12 December · Clinician-led reset', content: 'The clinician will use the review to decide whether Liam needs a new Now priority, enrichment goals, or a lighter maintenance rhythm.' },
          later: { title: 'New priority order', meta: 'Set after review · Not decided yet', content: 'The next Now, Next, and Later sequence should not be assumed from the completed plan. It will be agreed after the review conversation.' }
        },
        emerging: { title: 'Sustained Mastery', description: 'Liam continues to demonstrate high retention of co-regulation strategies in unstructured settings.' }
      },
      understanding: {
        description: 'Liam has achieved all current developmental milestones. He is now demonstrating marked improvements in task persistence and creative depth, maintaining 100% goal alignment.',
        focusAreas: [
          { title: 'Self-Correction Mastery', description: 'Liam identifies frustration triggers early and self-corrects without intervention in 90% of observed sessions.', sources: ['You', 'Teacher', 'Clinician'] },
          { title: 'Task Endurance', description: 'Liam can follow multi-step instructions and remain engaged in complex play for over 45 minutes.', sources: ['You', 'Teacher'] }
        ]
      },
      priorities: {
        description: 'Liam has met all core priorities for this quarter. The next priority order will be decided after the upcoming review session.'
      }
    };
  }

  if (child.name === 'Noah') {
    return {
      home: {
        focusTitle: 'Plan just started',
        focusDescription: 'Noah\'s first quarter plan is ready, but progress is still at 0%. Start with the first support step and collect the first week of observations before judging what is changing.',
        focusAction: 'Start the first action',
        timeline: {
          now: { title: 'Classroom starting routine', meta: 'High impact · ready to begin', content: 'Noah\'s first priority is classroom focus, but this is still a starting point. The useful next signal is whether one routine can be repeated without adding too much pressure.' },
          next: { title: 'After-school reset', meta: 'Moderate impact · prepare once the first routine starts', content: 'After-school emotion and fatigue matter, but they should sit behind the first classroom routine for now. Once the school support is underway, this becomes easier to understand.' },
          later: { title: 'Group confidence', meta: 'Safe to protect · not a task today', content: 'Noah\'s connection with familiar adults and peers is a useful strength. It stays later so the first plan can focus on school access without turning every area into work.' }
        },
        emerging: { title: 'Baseline still settling', description: 'Nothing needs escalating yet. The important signal is whether the first support routine becomes usable in everyday life.' }
      },
      understanding: {
        description: 'Noah is a bright, imaginative child whose biggest challenge right now is staying focused in structured settings — and it is starting to affect confidence at school. His social and emotional foundations are strong.',
        focusAreas: [
          { title: 'Classroom Attention', description: 'Noah finds it hard to sustain focus in structured tasks, especially in the classroom. The pattern is consistent across settings and is the clearest theme in everything we have gathered.', sources: ['You', 'Teacher', 'Clinician', 'Noah'] },
          { title: 'Social Emotional Resilience', description: 'Noah has warm, steady friendships and strong emotional awareness, which provides a strong foundation to support his learning challenges.', sources: ['You', 'Noah'] }
        ]
      },
      priorities: {
        description: 'We do not hand you a list of everything. We rank what matters by its real impact on Noah — and show the reasoning behind every call.'
      }
    };
  }
  
  if (child.name === 'Sophia') {
    return {
      home: {
        focusTitle: 'Executive function',
        focusDescription: 'This is the priority most likely to improve Sophia\'s day right now — it\'s affecting her ability to manage complex school assignments and reduces stress.',
        focusAction: 'Set up the visual assignment planner',
        timeline: {
          now: { title: 'Executive function', meta: 'High impact · started 3 weeks ago', content: 'Struggling with multi-step tasks is causing unnecessary anxiety.' },
          next: { title: 'Peer relationship navigation', meta: 'Moderate impact · prepare over coming months', content: 'Helping Sophia set healthy boundaries with peers is the natural next step.' },
          later: { title: 'Sleep routines', meta: 'Safe to wait · revisit at next review', content: 'Sleep is mostly stable, though occasional late nights studying should be monitored.' }
        },
        emerging: { title: 'Test anxiety', description: 'Sophia has mentioned feeling overwhelmed before assessments. We\'ll monitor this trend.' }
      },
      understanding: {
        description: 'Sophia is a thoughtful, observant child with a strong sense of justice. She is currently navigating the complexities of older peer group dynamics and managing academic pressures in a demanding year.',
        focusAreas: [
          { title: 'Executive Function', description: 'Sophia is mastering time management and organizational strategies for complex assignments, sometimes feeling overwhelmed by long-term projects.', sources: ['You', 'Teacher', 'Sophia'] },
          { title: 'Social Dynamics', description: 'Navigating peer relationships and building resilience against social pressures is a key area of focus for her emotional wellbeing.', sources: ['You', 'Sophia'] }
        ]
      },
      priorities: {
        description: 'We prioritize supporting Sophia\'s organizational confidence and social navigation, providing her with the frameworks to manage her schedule effectively and express her boundaries.'
      }
    };
  }

  // Default to Maya
  return {
    home: {
      focusTitle: 'Classroom attention',
      focusDescription: 'This is the priority most likely to improve Maya\'s day right now — it\'s affecting her learning and her confidence at school.',
      focusAction: 'Share the classroom strategy pack with Maya\'s teacher',
      timeline: {
        now: { title: 'Classroom attention', meta: 'High impact · clearest theme across every source', content: 'Trouble staying focused in class is currently the biggest drag on Maya\'s learning and self-confidence. Addressing it first tends to make other supports work better too.' },
        next: { title: 'Emotional regulation at home', meta: 'Moderate impact · prepare over coming months', content: 'Frustration around homework and changes in routine is real, and it is hard on home life. But it sits downstream of attention, so we expect it to ease as focus improves.' },
        later: { title: 'Friendships & social connection', meta: 'Safe to wait · currently a strength', content: 'Maya has warm, steady friendships and real empathy. This is going well, so it does not need your attention today.' }
      },
      emerging: { title: 'Sleep may start affecting focus', description: 'Recent check-ins suggest sleep could become a priority soon. Nothing to act on yet — we\'ll let you know if it does.' }
    },
    understanding: {
      description: 'Maya is a bright, imaginative child whose biggest challenge right now is staying focused in structured settings — and it\'s starting to affect her confidence at school. Her social and emotional foundations are strong.',
      focusAreas: [
        { title: 'Classroom Attention', description: 'Maya finds it hard to sustain focus in structured tasks, especially in the classroom. The pattern is consistent across settings and is the clearest theme in everything we\'ve gathered.', sources: ['You', 'Teacher', 'Clinician', 'Maya'] },
        { title: 'Social Emotional Resilience', description: 'Maya has warm, steady friendships and strong emotional awareness, which provides a great foundation to support her learning challenges.', sources: ['You', 'Maya'] }
      ]
    },
    priorities: {
      description: 'We don\'t hand you a list of everything. We rank what matters by its real impact on Maya — and show the reasoning behind every call.'
    }
  };
};
