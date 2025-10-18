import SwiftUI

struct EmailObject: Identifiable {
    let id = UUID()
    var senderName: String
    var emailMessage: String
    var photoUrl: String
}

struct LabelObject: Identifiable {
    let id = UUID()
    var label: String
}

let emails = [
    EmailObject(senderName: "Michael Phelps", emailMessage: "Thanks! I’ve received the files. Everything looks good on my end. Appreciate the quick turnaround.", photoUrl: "https://unsplash.com/photos/grayscale-photo-of-man-XHVpWcr5grQ"),
    EmailObject(senderName: "John Doe", emailMessage: "Hey team, this one’s fixed and merged to main. Let me know if anything else pops up.", photoUrl: "https://unsplash.com/photos/silhouette-photography-of-man-standing-near-trees-OBufvGMaBaQ"),
    EmailObject(senderName: "Jane Doe", emailMessage: "Here are the meeting notes and action items from today’s Q3 strategy call. Feel free to reach out if you", photoUrl: "https://unsplash.com/photos/persons-silhouette-during-golden-hour-x_8oJhYU31k"),
    EmailObject(senderName: "Michael Phelps", emailMessage: "Thanks! I’ve received the files. Everything looks good on my end. Appreciate the quick turnaround.", photoUrl: "https://unsplash.com/photos/grayscale-photo-of-man-XHVpWcr5grQ"),
    EmailObject(senderName: "John Doe", emailMessage: "Hey team, this one’s fixed and merged to main. Let me know if anything else pops up.", photoUrl: "https://unsplash.com/photos/silhouette-photography-of-man-standing-near-trees-OBufvGMaBaQ"),
    EmailObject(senderName: "Jane Doe", emailMessage: "Here are the meeting notes and action items from today’s Q3 strategy call. Feel free to reach out if you", photoUrl: "https://unsplash.com/photos/persons-silhouette-during-golden-hour-x_8oJhYU31k")
]

let labels = [
    "Actioned", "To respond", "FYI", "Comment", "Notification", "Awaiting reply", "Risks", "Suggestions", "Opportunity"
]

struct LabelRow: View {
    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 4) {
                ForEach(labels, id: \.self) { label in
                    Text(label)
                        .font(.caption)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Color.white.opacity(0.12))
                        .foregroundColor(.white)
                        .clipShape(Capsule())
                        .overlay(
                            Capsule().stroke(Color.white.opacity(0.2), lineWidth: 0.5)
                        )
                }
            }
            .frame(maxWidth: .infinity, alignment: .center)
            .padding(.horizontal) // optional, keeps chips away from edges
        }
    }
}

struct EmailRow: View {
    var email: EmailObject
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(email.emailMessage)
                .foregroundColor(.secondary)
                .lineLimit(3)
                .font(.system(size: 12))
            HStack {
                Spacer()
                AsyncImage(url: URL(string: email.photoUrl)) { image in
                    image
                        .resizable()
                        .frame(width: 20, height: 20)
                        .clipShape(Circle())
                } placeholder: {
                    Circle()
                        .fill(Color.gray.opacity(0.3))
                        .frame(width: 20, height: 20)
                }
            }
        }
        .padding(8)
        .frame(width: 228, height: 92)
        .background(Color(red: 0.32, green: 0.59, blue: 0.89).opacity(0.2))
        .cornerRadius(12) // <- radius 12
    }
}

struct EmailView: View {
    var body: some View {
        VStack {
            ScrollView(.horizontal) {
                LazyHStack {
                    ForEach(emails) { email in
                        EmailRow(email: email)
                    }
                }
            }
            LabelRow()
        }
    }
}

struct EmailView_Previews: PreviewProvider {
    static var previews: some View {
        EmailView().frame(width: 600, height: 188)
    }
}
