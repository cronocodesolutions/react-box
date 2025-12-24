import { BoxComponentStyles } from '../../types';

export interface BoxComponent {
  clean?: boolean;
  styles?: BoxComponentStyles;
  variants?: Record<string, BoxComponentStyles>;
  children?: Record<string, BoxComponent>;
}

export type Components = Record<string, BoxComponent>;

const boxComponents = {
  h1: {
    styles: { fontSize: 14 * 2.5 },
  },
  h2: {
    styles: { fontSize: 14 * 2 },
  },
  h3: {
    styles: { fontSize: 14 * 1.75 },
  },
  h4: {
    styles: { fontSize: 14 * 1.5 },
  },
  h5: {
    styles: { fontSize: 14 * 1.25 },
  },
  h6: {
    styles: { fontSize: 14 * 1 },
  },
  span: {
    styles: { inline: true },
  },
  button: {
    styles: {
      display: 'inline-flex',
      color: 'white',
      bgColor: 'violet-500',
      borderColor: 'violet-500',
      p: 3,
      cursor: 'pointer',
      b: 1,
      borderRadius: 1,
      userSelect: 'none',
      lineHeight: 20,
      hover: {
        bgColor: 'violet-600',
        borderColor: 'violet-600',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'violet-50',
        color: 'gray-400',
        borderColor: 'gray-300',
      },
    },
    variants: {
      hover: {
        position: 'relative',
        overflow: 'hidden',
        b: 0,
        before: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: 0,
          height: 'fit',
          bgColor: 'violet-700',
          content: 'empty',
          transitionDuration: 300,
        },
        hover: { before: { width: 'fit' } },
      },
    },
  },
  textbox: {
    styles: {
      display: 'inline-block',
      b: 1,
      borderColor: 'violet-200',
      bgColor: 'violet-50',
      color: 'violet-950',
      borderRadius: 1,
      p: 3,
      transition: 'none',
      lineHeight: 20,
      hover: {
        borderColor: 'violet-300',
      },
      focus: {
        outline: 1,
        borderColor: 'violet-500',
        outlineColor: 'violet-500',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'violet-50',
        color: 'gray-400',
        borderColor: 'gray-300',
      },
    },
  },
  textarea: {
    styles: {
      display: 'inline-block',
      b: 1,
      borderColor: 'violet-200',
      bgColor: 'violet-50',
      color: 'violet-950',
      borderRadius: 1,
      p: 3,
      transition: 'none',
      hover: {
        borderColor: 'violet-300',
      },
      focus: {
        outline: 1,
        borderColor: 'violet-500',
        outlineColor: 'violet-500',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'violet-50',
        color: 'gray-400',
        borderColor: 'gray-300',
        resize: 'none',
      },
    },
  },
  checkbox: {
    styles: {
      display: 'inline-block',
      appearance: 'none',
      b: 1,
      borderColor: 'violet-300',
      borderRadius: 1,
      p: 2,
      cursor: 'pointer',
      transition: 'none',
      hover: {
        borderColor: 'violet-500',
      },
      focus: {
        outline: 2,
        outlineOffset: 2,
        outlineColor: 'violet-500',
      },
      checked: {
        bgColor: 'violet-500',
        borderColor: 'violet-500',
        bgImage: 'bg-img-checked',
      },
      indeterminate: {
        color: 'violet-500',
        bgImage: 'bg-img-indeterminate',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'violet-100',
        color: 'gray-400',
        borderColor: 'gray-300',
      },
    },
    variants: {
      datagrid: {},
    },
  },
  radioButton: {
    styles: {
      appearance: 'none',
      b: 1,
      borderColor: 'violet-300',
      borderRadius: 3,
      p: 2,
      cursor: 'pointer',
      transition: 'none',
      hover: {
        borderColor: 'violet-500',
      },
      focus: {
        outline: 2,
        outlineOffset: 2,
        outlineColor: 'violet-500',
      },
      checked: {
        bgColor: 'violet-500',
        borderColor: 'violet-500',
        bgImage: 'bg-img-radio',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'violet-100',
        color: 'gray-400',
        borderColor: 'violet-200',
      },
    },
  },
  dropdown: {
    styles: {
      display: 'inline-flex',
      ai: 'center',
      gap: 2,
      jc: 'space-between',
      p: 3,
      cursor: 'pointer',
      bgColor: 'violet-50',
      color: 'violet-950',
      b: 1,
      borderColor: 'violet-200',
      borderRadius: 1,
      userSelect: 'none',
      lineHeight: 20,
      minWidth: 40,
      transition: 'none',
      hover: {
        borderColor: 'violet-300',
      },
      focus: {
        outline: 1,
        borderColor: 'violet-500',
        outlineColor: 'violet-500',
      },
      disabled: {
        cursor: 'not-allowed',
        bgColor: 'violet-50',
        color: 'gray-400',
        borderColor: 'gray-300',
      },
    },
    children: {
      display: {
        styles: {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          overflow: 'hidden',
        },
      },
      items: {
        styles: {
          display: 'flex',
          d: 'column',
          gap: 1,
          p: 1,
          b: 1,
          borderRadius: 1,
          position: 'relative',
          top: 1,
          bgColor: 'white',
          overflow: 'auto',
          maxHeight: 62,
          borderColor: 'violet-300',
          color: 'violet-950',
          shadow: 'medium',
        },
      },
      item: {
        styles: {
          display: 'flex',
          width: 'fit',
          p: 3,
          cursor: 'pointer',
          borderRadius: 1,
          hover: {
            bgColor: 'gray-100',
          },
          focus: {
            bgColor: 'violet-50',
          },
          selected: {
            bgColor: 'violet-50',
            cursor: 'default',
            hover: {
              bgColor: 'violet-100',
            },
          },
        },
        variants: {
          multiple: {
            selected: {
              cursor: 'pointer',
            },
          },
        },
      },
      unselect: {
        styles: {
          display: 'flex',
          width: 'fit',
          p: 3,
          cursor: 'pointer',
          lineHeight: 20,
          borderRadius: 1,
          color: 'violet-400',
          hover: {
            bgColor: 'violet-50',
          },
          focus: {
            bgColor: 'violet-50',
          },
          selected: {
            bgColor: 'violet-50',
            cursor: 'default',
          },
        },
      },
      selectAll: {
        styles: {
          display: 'flex',
          width: 'fit',
          p: 3,
          cursor: 'pointer',
          lineHeight: 20,
          borderRadius: 1,
          color: 'violet-400',
          hover: {
            bgColor: 'violet-50',
          },
          focus: {
            bgColor: 'violet-50',
          },
          selected: {
            bgColor: 'violet-50',
            cursor: 'default',
          },
        },
      },
      emptyItem: {
        styles: {
          display: 'flex',
          width: 'fit',
          p: 3,
          cursor: 'default',
          lineHeight: 20,
          borderRadius: 1,
          color: 'violet-400',
        },
      },
    },
  },
  label: { styles: {} },
  datagrid: {
    styles: {
      b: 1,
      bgColor: 'white',
      borderColor: 'gray-200',
      overflow: 'hidden',
      borderRadius: 3,
      shadow: 'large',
      theme: {
        dark: {
          bgColor: 'gray-950',
          borderColor: 'gray-800',
        },
      },
    },
    children: {
      topBar: {
        styles: {
          py: 3,
          px: 4,
          bb: 1,
          borderColor: 'gray-200',
          color: 'gray-800',
          gap: 3,
          ai: 'center',
          bgColor: 'gray-50',
          theme: {
            dark: {
              bgColor: 'gray-900',
              borderColor: 'gray-800',
              color: 'gray-200',
            },
          },
        },
        children: {
          contextMenu: {
            clean: true,
            styles: {
              cursor: 'pointer',
              p: 2,
              borderRadius: 2,
              transition: 'all',
              transitionDuration: 150,
              hover: {
                bgColor: 'gray-100',
              },
              theme: {
                dark: {
                  hover: {
                    bgColor: 'gray-800',
                  },
                },
              },
            },
            children: {
              tooltip: {
                styles: {
                  bgColor: 'white',
                  width: 56,
                  b: 1,
                  borderColor: 'gray-200',
                  borderRadius: 3,
                  display: 'flex',
                  d: 'column',
                  mt: 2,
                  py: 2,
                  translateX: -1,
                  shadow: 'large',
                  overflow: 'auto',
                  maxHeight: 100,
                  zIndex: 100,
                  theme: {
                    dark: {
                      bgColor: 'gray-900',
                      borderColor: 'gray-800',
                    },
                  },
                },
                children: {
                  item: {
                    clean: true,
                    styles: {
                      display: 'flex',
                      gap: 3,
                      py: 2.5,
                      px: 4,
                      cursor: 'pointer',
                      transition: 'all',
                      transitionDuration: 150,
                      hover: {
                        bgColor: 'violet-50',
                      },
                      theme: {
                        dark: {
                          hover: {
                            bgColor: 'gray-800',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          columnGroups: {
            styles: {
              gap: 2,
              ai: 'center',
            },
            children: {
              icon: {
                styles: {
                  color: 'gray-700',
                  width: 4,
                  theme: {
                    dark: {
                      color: 'gray-300',
                    },
                  },
                },
              },
              separator: {
                styles: {},
              },
              item: {
                styles: {
                  gap: 2,
                  ai: 'center',
                  b: 1,
                  borderColor: 'gray-300',
                  bgColor: 'white',
                  borderRadius: 2,
                  py: 2,
                  pl: 3,
                  pr: 2,
                  color: 'gray-800',
                  fontSize: 14,
                  fontWeight: 500,
                  shadow: 'small',
                  transition: 'all',
                  transitionDuration: 150,
                  theme: {
                    dark: {
                      bgColor: 'gray-800',
                      borderColor: 'gray-700',
                      color: 'gray-200',
                    },
                  },
                },
                children: {
                  icon: {
                    styles: {
                      width: 3,
                      color: 'gray-500',
                      cursor: 'pointer',
                      transition: 'all',
                      transitionDuration: 150,
                      hover: {
                        color: 'gray-700',
                      },
                      theme: {
                        dark: {
                          color: 'gray-400',
                          hover: {
                            color: 'gray-200',
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },

      // Filter row with inputs for each column
      filter: {
        styles: {},
        children: {
          row: {
            styles: {
              bgColor: 'gray-50',
              bb: 1,
              borderColor: 'gray-200',
              theme: {
                dark: {
                  bgColor: 'gray-900',
                  borderColor: 'gray-800',
                },
              },
            },
          },
          cell: {
            styles: {
              p: 2,
              transition: 'none',
            },
            variants: {
              isPinned: {
                position: 'sticky',
                bgColor: 'gray-50',
                zIndex: 2,
                theme: {
                  dark: {
                    bgColor: 'gray-900',
                  },
                },
              },
              isFirstLeftPinned: {},
              isLastLeftPinned: { br: 1, borderColor: 'gray-200' },
              isFirstRightPinned: { bl: 1, borderColor: 'gray-200' },
              isLastRightPinned: {},
            },
          },
          text: {
            styles: {
              display: 'inline-block',
              b: 1,
              borderColor: 'gray-300',
              bgColor: 'white',
              borderRadius: 2,
              py: 2,
              px: 2.5,
              fontSize: 13,
              transition: 'all',
              transitionDuration: 150,
              focus: {
                outline: 2,
                outlineOffset: 0,
                borderColor: 'violet-500',
                outlineColor: 'violet-100',
              },
              theme: {
                dark: {
                  bgColor: 'gray-800',
                  borderColor: 'gray-700',
                  color: 'gray-100',
                  focus: {
                    borderColor: 'violet-500',
                    outlineColor: 'violet-950',
                  },
                },
              },
            },
          },
          number: {
            styles: {
              display: 'inline-block',
              b: 1,
              borderColor: 'gray-300',
              bgColor: 'white',
              borderRadius: 2,
              py: 2,
              px: 2.5,
              fontSize: 13,
              transition: 'all',
              transitionDuration: 150,
              focus: {
                outline: 2,
                outlineOffset: 0,
                borderColor: 'violet-500',
                outlineColor: 'violet-100',
              },
              theme: {
                dark: {
                  bgColor: 'gray-800',
                  borderColor: 'gray-700',
                  color: 'gray-100',
                  focus: {
                    borderColor: 'violet-500',
                    outlineColor: 'violet-950',
                  },
                },
              },
            },
          },
          select: {
            styles: {
              b: 1,
              borderColor: 'gray-300',
              bgColor: 'white',
              borderRadius: 2,
              py: 2,
              px: 2.5,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all',
              transitionDuration: 150,
              hover: {
                borderColor: 'gray-400',
              },
              theme: {
                dark: {
                  bgColor: 'gray-800',
                  borderColor: 'gray-700',
                  color: 'gray-100',
                  hover: {
                    borderColor: 'gray-600',
                  },
                },
              },
            },
          },
          multiselect: {
            styles: {
              b: 1,
              borderColor: 'gray-300',
              bgColor: 'white',
              borderRadius: 2,
              py: 2,
              px: 2.5,
              fontSize: 13,
              cursor: 'pointer',
              transition: 'all',
              transitionDuration: 150,
              hover: {
                borderColor: 'gray-400',
              },
              theme: {
                dark: {
                  bgColor: 'gray-800',
                  borderColor: 'gray-700',
                  color: 'gray-100',
                  hover: {
                    borderColor: 'gray-600',
                  },
                },
              },
            },
            children: {
              dropdown: {
                styles: {
                  bgColor: 'white',
                  b: 1,
                  borderColor: 'gray-200',
                  borderRadius: 3,
                  shadow: 'large',
                  theme: {
                    dark: {
                      bgColor: 'gray-900',
                      borderColor: 'gray-800',
                    },
                  },
                },
              },
            },
          },
        },
      },

      header: {
        styles: {
          position: 'sticky',
          top: 0,
          width: 'max-content',
          minWidth: 'fit',
          zIndex: 3,
          bgColor: 'gray-50',
          theme: {
            dark: {
              bgColor: 'gray-900',
            },
          },
        },
        variants: {
          isResizeMode: { userSelect: 'none' },
        },
        children: {
          cell: {
            styles: {
              borderColor: 'gray-200',
              bb: 1,
              minHeight: 12,
              position: 'relative',
              transition: 'none',
              fontSize: 13,
              fontWeight: 600,
              color: 'gray-800',
              py: 3.5,
              px: 4,
              theme: {
                dark: {
                  borderColor: 'gray-800',
                  color: 'gray-200',
                },
              },
            },
            variants: {
              isPinned: {
                position: 'sticky',
                zIndex: 4,
                bgColor: 'gray-50',
                theme: {
                  dark: {
                    bgColor: 'gray-900',
                  },
                },
              },
              isFirstLeftPinned: {},
              isLastLeftPinned: {
                br: 1,
                borderColor: 'gray-200',
                theme: {
                  dark: {
                    borderColor: 'gray-800',
                  },
                },
              },
              isFirstRightPinned: {
                bl: 1,
                borderColor: 'gray-200',
                theme: {
                  dark: {
                    borderColor: 'gray-800',
                  },
                },
              },
              isLastRightPinned: {},
              isSortable: {
                cursor: 'pointer',
                hover: {
                  bgColor: 'gray-100',
                },
                theme: {
                  dark: {
                    hover: {
                      bgColor: 'gray-800',
                    },
                  },
                },
              },
              isRowSelected: {},
              isRowSelection: {},
              isRowNumber: { jc: 'center' },
            },
            children: {
              contextMenu: {
                clean: true,
                styles: {
                  width: 6,
                  height: 6,
                  cursor: 'pointer',
                  userSelect: 'none',
                  borderRadius: 1,
                  display: 'flex',
                  jc: 'center',
                  ai: 'center',
                  transition: 'all',
                  transitionDuration: 150,
                  hover: {
                    bgColor: 'gray-300',
                  },
                },
                children: {
                  icon: {
                    styles: {},
                  },
                  tooltip: {
                    styles: {
                      bgColor: 'white',
                      width: 56,
                      b: 1,
                      borderColor: 'gray-200',
                      borderRadius: 3,
                      display: 'flex',
                      d: 'column',
                      mt: 2,
                      py: 2,
                      overflow: 'hidden',
                      translateX: -5,
                      shadow: 'large',
                      zIndex: 100,
                      theme: {
                        dark: {
                          bgColor: 'gray-900',
                          borderColor: 'gray-800',
                        },
                      },
                    },
                    variants: {
                      openLeft: { translateX: -55 },
                    },
                    children: {
                      item: {
                        clean: true,
                        styles: {
                          display: 'flex',
                          gap: 3,
                          py: 2.5,
                          px: 4,
                          cursor: 'pointer',
                          transition: 'all',
                          transitionDuration: 150,
                          hover: {
                            bgColor: 'violet-50',
                          },
                          theme: {
                            dark: {
                              hover: {
                                bgColor: 'gray-800',
                              },
                            },
                          },
                        },
                        children: {
                          icon: {
                            styles: {
                              width: 4,
                              color: 'gray-700',
                              theme: {
                                dark: {
                                  color: 'gray-300',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              resizer: {
                styles: {
                  width: 0.5,
                  height: 'fit',
                  bgColor: 'gray-400',
                  cursor: 'col-resize',
                  transition: 'all',
                  transitionDuration: 150,
                  hoverGroup: {
                    resizer: {
                      bgColor: 'violet-500',
                      width: 1,
                    },
                  },
                },
              },
            },
          },
        },
      },
      body: {
        styles: {
          theme: {
            dark: {
              bgColor: 'gray-950',
            },
          },
        },
        children: {
          cell: {
            styles: {
              bb: 1,
              borderColor: 'gray-200',
              transition: 'all',
              transitionDuration: 100,
              ai: 'center',
              py: 3,
              px: 4,
              fontSize: 14,
              color: 'gray-900',
              hoverGroup: {
                'grid-row': {
                  bgColor: 'violet-50',
                },
              },
              theme: {
                dark: {
                  borderColor: 'gray-800',
                  color: 'gray-100',
                },
              },
            },
            variants: {
              isPinned: {
                position: 'sticky',
                bgColor: 'white',
                zIndex: 1,
                theme: {
                  dark: {
                    bgColor: 'gray-950',
                  },
                },
              },
              isFirstLeftPinned: {},
              isLastLeftPinned: {
                br: 1,
                borderColor: 'gray-200',
                theme: {
                  dark: {
                    borderColor: 'gray-800',
                  },
                },
              },
              isFirstRightPinned: {
                bl: 1,
                borderColor: 'gray-200',
                theme: {
                  dark: {
                    borderColor: 'gray-800',
                  },
                },
              },
              isLastRightPinned: {},
              isRowNumber: {
                bgColor: 'gray-50',
                jc: 'right',
                fontWeight: 500,
                color: 'gray-600',
                theme: {
                  dark: {
                    bgColor: 'gray-900',
                    color: 'gray-400',
                  },
                },
              },
              isRowSelection: {},
              isRowSelected: {},
            },
          },
        },
      },
      bottomBar: {
        styles: {
          py: 3,
          px: 4,
          bgColor: 'gray-50',
          bt: 1,
          borderColor: 'gray-200',
          gap: 4,
          ai: 'center',
          fontSize: 14,
          color: 'gray-800',
          theme: {
            dark: {
              bgColor: 'gray-900',
              borderColor: 'gray-800',
              color: 'gray-200',
            },
          },
        },
      },
    },
  },
} satisfies Components;

export default boxComponents;
