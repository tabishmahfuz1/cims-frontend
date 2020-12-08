import React from "react";
import invariant from "invariant";
import {
  LinkMessage,
  ImageMessage,
  DocumentMessage
} from "foundations/components/chat";
import { AttachmentType, Attachment } from "sharedTypes/messageModel";

type AttachmentProps = {
  attachment: Attachment;
};

/**
 * Display an attachment based on its type
 */
export const AttachmentDisplay = ({ attachment }: AttachmentProps) => {
  switch (attachment.type) {
    case AttachmentType.Document: {
      const nameParts = attachment?.file?.name?.split(".");

      const props = {
        id: attachment.file.fileId,
        type: nameParts ? nameParts[nameParts.length - 1] : undefined,
        description: attachment.description,
        title: attachment.file.name,
        image: attachment.preview?.source
      };
      return <DocumentMessage {...props} />;
    }
    case AttachmentType.Link:
      const props = {
        provider: attachment.provider,
        url: attachment.url,
        title: attachment.title,
        description: attachment.description,
        image: attachment.image?.source,
        icon: attachment.icon?.source,
        author: attachment.author
      };
      return <LinkMessage {...props}></LinkMessage>;
    case AttachmentType.Image:
      return <ImageMessage image={attachment.image.source}></ImageMessage>;

    // <== Add additional attachment types here.

    // Don't show anything for an unrecognized attachment type
    default:
      invariant(
        false,
        `No component available for displaying attachment of type "${attachment.type}"`
      );
  }
};
